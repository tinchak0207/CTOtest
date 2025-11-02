#!/usr/bin/env python3
import re
import json
from pathlib import Path

base = Path('/home/engine/project')
text = base.joinpath('DEMO.md').read_text(encoding='utf-8')

single_match = re.search(r'一、单选题\(100题\)(.*?)(?=\n\s*二、多选题)', text, re.S)
multi_match = re.search(r'二、多选题[（(]100题[）)](.*?)(?=\n\s*三、判断题)', text, re.S)
judgment_match = re.search(r'三、判断题[（(]100题[）)](.*)', text, re.S)

if not (single_match and multi_match and judgment_match):
    raise SystemExit('Failed to locate all sections in DEMO.md; please verify the headings.')

single_chunk = single_match.group(1)
multi_chunk = multi_match.group(1)
judgment_chunk = judgment_match.group(1)

# Remove answer sections
single_body, single_answer_block = single_chunk.rsplit('参考答案：', 1)
single_answer_block = single_answer_block.strip()
multi_body, multi_answer_block = multi_chunk.rsplit('参考答案：', 1)
multi_answer_block = multi_answer_block.strip()
judgment_body, judgment_answer_block = judgment_chunk.rsplit('参考答案：', 1)
judgment_answer_block = judgment_answer_block.strip()

category_templates = {
    'speech': {
        'name': '语音与语音识别',
        'description': '语音分帧、语音识别分类、eSpeak参数、YanAPI语音接口与语音交互项目相关内容。'
    },
    'vision': {
        'name': '图像处理与视觉感知',
        'description': 'OpenCV色彩空间、轮廓检测、图像预处理、颜色追踪项目流程等问题点。'
    },
    'ml': {
        'name': '机器学习与数据建模',
        'description': 'MNIST数据集结构、struct数据处理、sklearn库、KNN分类与模型部署相关知识。'
    },
    'robotics': {
        'name': '机器人基础与硬件',
        'description': '机器人类型、关节与自由度、舵机参数、运动学概念以及服务机器人硬件构成。'
    },
    'ros': {
        'name': 'ROS系统与导航',
        'description': 'ROS命令、move_base、rviz、costmap、导航准备与功能包组成。'
    },
    'slam': {
        'name': 'SLAM与定位建图',
        'description': 'KartoSLAM流程、回环检测、AMCL订阅发布、TEB路径规划与激光雷达建图要点。'
    },
    'controls': {
        'name': '控制协同与系统集成',
        'description': '协程线程队列控制、机器人追踪流程、移动控制以及项目实操注意事项。'
    },
    'general': {
        'name': '综合拓展与行业认知',
        'description': '机器人发展历史、国际品牌、行业应用、安全规范与综合判断题要点。'
    }
}

category_keywords = [
    ('speech', ['语音', 'espeak', 'sphinx', 'yanapi', '语料', '发音', '音频', 'voice', 'asr']),
    ('vision', ['图像', 'cv2', '颜色', '轮廓', 'hsv', '像素', '图片', 'camera', 'videocapture', 'mask', 'opencv']),
    ('ml', ['mnist', 'sklearn', 'knn', 'mobilenet', '模型', '训练', '数据集', 'machine', 'scikit', 'struct', 'joblib', 'ocr', '模式识别']),
    ('ros', ['ros', 'rostopic', 'rosdep', 'rosrun', 'rviz', 'move_base', 'teleop', 'navigation', 'topic', 'map_server', 'costmap', 'roslaunch']),
    ('slam', ['slam', 'kartoslam', '回环', 'amcl', 'teb', 'localization', '激光', '地图', 'map', '粒子', 'global planner', 'recovery']),
    ('controls', ['协程', '线程', 'queue', 'track', '追踪', '控制', 'forward_step', 'walk_track', 'move_slow_and_clear', '调试']),
    ('robotics', ['机器人', '舵机', '自由度', '连杆', '运动学', '关节', '位姿', '机械手', '姿态', 'urdf', '手臂', '关节变量', '工作空间', '动力学'])
]

def assign_category(question_text, options_text):
    combined = (question_text + ' ' + options_text).lower()
    for cat_id, keywords in category_keywords:
        for kw in keywords:
            if kw.lower() in combined:
                return cat_id
    return 'general'


def normalize_punctuation(text):
    return text.replace('．', '.').replace('：', ':').replace('（', '(').replace('）', ')')


INLINE_TRUE_FALSE_SUFFIX = re.compile(
    r'\s*[（(]\s*([TFtf√×对错真假是否YN])\s*[)）]\s*(?P<tail>[。．.!！?？、,，]*)\s*(?:改)?\s*$'
)

def strip_inline_true_false(text):
    match = INLINE_TRUE_FALSE_SUFFIX.search(text)
    if not match:
        return text.strip()
    tail = match.group('tail') or ''
    cleaned = text[:match.start()].rstrip()
    return f"{cleaned}{tail}".strip()

def parse_choice_section(section_text, qtype):
    lines = [normalize_punctuation(line.rstrip()) for line in section_text.strip().split('\n')]
    questions = []
    current = None
    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        m = re.match(r'^(\d+)\.?\s*(.*)$', line)
        if m and (current is None or m.group(1) != str(current['index'])):
            if current:
                questions.append(current)
            idx = int(m.group(1))
            rest = m.group(2).strip()
            current = {'index': idx, 'question_text': rest, 'option_lines': [], 'options_started': False}
            continue
        if current is None:
            continue
        opt_match = re.match(r'^[A-F][\.|、]\s*', line)
        if opt_match:
            current['options_started'] = True
            current['option_lines'].append(line)
        else:
            if current['options_started']:
                current['option_lines'].append(line)
            else:
                current['question_text'] += ' ' + line
    if current:
        questions.append(current)

    parsed = []
    for q in questions:
        qtext = q['question_text']
        ans_match = re.search(r'[(]\s*([A-F]+)\s*[)]', qtext)
        answers = []
        if ans_match:
            answers = list(ans_match.group(1))
            qtext = (qtext[:ans_match.start()] + qtext[ans_match.end():]).strip()
        option_text_block = ' '.join(q['option_lines'])
        option_text_block = normalize_punctuation(option_text_block)
        sentinel = option_text_block
        for letter in ['A', 'B', 'C', 'D', 'E', 'F']:
            sentinel = sentinel.replace(f'{letter}.', f'||{letter}.')
        parts = [part for part in sentinel.split('||') if part]
        options = []
        for part in parts:
            part = part.strip()
            if not part:
                continue
            key = part[0]
            text = part[2:].strip()
            options.append({'key': key, 'text': text})
        options_text_concat = ' '.join(opt['text'] for opt in options)
        category_id = assign_category(qtext, options_text_concat)
        parsed.append({
            'index': q['index'],
            'question': qtext,
            'answers': answers,
            'options': options,
            'category': category_id,
            'type': qtype
        })
    return parsed

single_questions = parse_choice_section(single_body, 'single')
multi_questions = parse_choice_section(multi_body, 'multiple')

# Parse judgment questions
judgment_lines = [normalize_punctuation(line.rstrip()) for line in judgment_body.strip().split('\n') if line.strip()]
judgment_questions = []
current = None
for raw_line in judgment_lines:
    line = raw_line.strip()
    m = re.match(r'^(\d+)\.\s*(.*)$', line)
    if m:
        if current:
            judgment_questions.append(current)
        idx = int(m.group(1))
        qtext = m.group(2).strip()
        qtext = re.sub(r'\(\s*\)$', '', qtext).strip()
        current = {'index': idx, 'question': qtext}
    else:
        if current:
            current['question'] += ' ' + line
if current:
    judgment_questions.append(current)

for item in judgment_questions:
    cleaned = strip_inline_true_false(item['question'])
    if cleaned:
        item['question'] = cleaned

# Parse judgment answers
judgment_answer_map = {}
for token_line in normalize_punctuation(judgment_answer_block).split('\n'):
    token_line = token_line.strip()
    if not token_line:
        continue
    segments = [seg for seg in token_line.split() if seg]
    for seg in segments:
        if ':' not in seg:
            continue
        scope, pattern = seg.split(':', 1)
        scope = scope.replace('-', ' - ')
        scope_parts = [part for part in scope.split() if part != '-']
        if len(scope_parts) == 2:
            start, end = map(int, scope_parts)
        else:
            start = end = int(scope_parts[0])
        pattern = pattern.strip()
        for offset, symbol in enumerate(pattern, start=start):
            judgment_answer_map[offset] = 'A' if symbol in ('√', 'T', 'Y', '1') else 'B'

judgment_parsed = []
for item in judgment_questions:
    options = [
        {'key': 'A', 'text': '正确'},
        {'key': 'B', 'text': '错误'}
    ]
    cat_id = assign_category(item['question'], '')
    answer_key = judgment_answer_map.get(item['index'])
    if not answer_key:
        raise ValueError(f'未找到判断题第{item["index"]}题的答案，请检查答案块。')
    judgment_parsed.append({
        'index': item['index'],
        'question': item['question'],
        'answers': [answer_key],
        'options': options,
        'category': cat_id,
        'type': 'truefalse'
    })

if len(single_questions) != 100:
    raise ValueError(f'单选题数量解析错误：{len(single_questions)}')
if len(multi_questions) != 100:
    raise ValueError(f'多选题数量解析错误：{len(multi_questions)}')
if len(judgment_parsed) != 100:
    raise ValueError(f'判断题数量解析错误：{len(judgment_parsed)}')

combined = []
for item in single_questions:
    answer_texts = [opt['text'] for opt in item['options'] if opt['key'] in item['answers']]
    combined.append({
        'id': f'SC-{item["index"]}',
        'order': item['index'],
        'type': 'single',
        'question': item['question'],
        'options': item['options'],
        'correctOptions': item['answers'],
        'category': item['category'],
        'sourceIndex': item['index'],
        'learningPoint': f"{item['question']} 正确答案：{'、'.join(answer_texts)}",
        'explanation': f"正确答案：{'、'.join(answer_texts)}"
    })

for item in multi_questions:
    answer_texts = [opt['text'] for opt in item['options'] if opt['key'] in item['answers']]
    combined.append({
        'id': f'MC-{item["index"]}',
        'order': item['index'],
        'type': 'multiple',
        'question': item['question'],
        'options': item['options'],
        'correctOptions': item['answers'],
        'category': item['category'],
        'sourceIndex': item['index'],
        'learningPoint': f"{item['question']} 正确答案：{'、'.join(answer_texts)}",
        'explanation': f"正确答案：{'、'.join(answer_texts)}"
    })

for item in judgment_parsed:
    answer_texts = [opt['text'] for opt in item['options'] if opt['key'] in item['answers']]
    combined.append({
        'id': f'TF-{item["index"]}',
        'order': item['index'],
        'type': 'truefalse',
        'question': item['question'],
        'options': item['options'],
        'correctOptions': item['answers'],
        'category': item['category'],
        'sourceIndex': item['index'],
        'learningPoint': f"{item['question']} 判断：{'、'.join(answer_texts)}",
        'explanation': f"判断结果：{'、'.join(answer_texts)}"
    })

combined.sort(key=lambda x: (x['type'], x['sourceIndex']))

output = {
    'categories': [
        {'id': cid, 'name': info['name'], 'description': info['description']}
        for cid, info in category_templates.items()
    ],
    'questions': combined
}

output_path = base.joinpath('data')
output_path.mkdir(exist_ok=True)
output_file = output_path.joinpath('questions.json')
output_file.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Generated {output_file} with {len(combined)} questions')
print(f'- Single choice: {len(single_questions)}')
print(f'- Multiple choice: {len(multi_questions)}')
print(f'- True/False: {len(judgment_parsed)}')
