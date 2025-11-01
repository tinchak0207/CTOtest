服务机器人应用开发（中级）证书试题
一、单选题(100题)
1．	如图所示为语音声音分帧处理示意图，每帧的长度为25毫秒，每两帧之间有15毫秒的交叠，则帧移为（ B  ）。
 
A．25ms                B．10ms    
C．15ms                D．40ms

2．	下面属于常见的有损压缩音频格式为（  A ）。
A.MP3         B.WAV       C.TAK       D.APE
3．	根据识别的对象不同，语音识别任务大体可分为3类，但不包含（ B  ）。
A孤立词识别     B语义识别     C连续语音识别     D关键词识别。

4．	语音识别开始时，需要切除首尾端的静音，这个静音切除的操作一般称为（ D  ）。
A.CMU    B.PCM
C.HMM    D.VAD

5．	Yanshee机器人采用Raspberry Pi + STM32 开放式硬件平台架构，（ B  ）个自由度的高度拟人设计，内置800万像素摄像头、陀螺仪及多种通信模块。
A. 11              
B. 17
C. 13                 
D. 15

6．	下列哪个网站工具可以对语料文本文件进行训练加工（  D ）。
A.Sphinx          
B.corpus
C.PocketSphinx    
D.Imtool

7．	eSpeak使用的技术是（ A  ）
A.共振峰合成       B.LPC参数合成
C.PSOLA拼接合成    D.LMA声道模型技术合成

8．	eSpeak是用编程语言（  B ）编写的。
A.Java        B.C语言
C.Python      D.PHP

9．	语音合成技术的发展，经历了共振峰合成、拼接合成、（  C ）、基于神经网络的语音合成等几个发展重要时间节点。
A.构建高斯模型
B.韵律建模
C.统计参数合成
D.声学建模

10．	下面哪一种不属于eSpeak的特性？（ A  ）。
A.真实平滑  B.清晰  C.快速  D.音位编码

11．	eSpeak中，英文发音代码简写为（ C  ）。
A.de     B.fe     C.en    D.zh

12．	树莓派中，想检验eSpeak是否正常安装，查询eSpeak版本号的命令为（  C ）。
A.espeak version          B. espeak -version
C.espeak --version        D. espeak ---version

13．	想要Yanshee发出“hello yanshee”的男式英文发音，需要输入的代码为（ D  ）。
A.espeak –vzh“hello yanshee”
B.espeak –vzh+f3 –k5 –s150“hello yanshee”
C. espeak –ven+f2“hello yanshee”
D. espeak –ven+m3“hello yanshee”

14．	eSpeak设置音色的参数为（ A  ）。
A.-v           B.-a
C.-s           D.-p

15．	eSpeak设置声音幅度的参数为（  B ）。
A.-v           B.-a
C.-s           D.-p

16．	eSpeak设置读取句子速度的参数为（  C ）。
A.-v           B.-a
C.-s           D.-p

17．	eSpeak创建WAV文件需要加的参数为（ C  ）。
A.-k           B.-g
C.-w           D.-p

18．	关于Python面向对象编程，错误的是？（A   ）
A.类继承机制仅允许单继承         
B.派生类可以覆盖基类的任何方法
C.对象在运行时创建         
D.对象在创建后可以修改

19．	如果三种原色光各分到10比特，那么对应显卡能产生多少种颜色？（ B  ）
A.16777216     B.1073741824
C.256          D.30

20．	当图像由RGB色彩空间转换为Gray色彩空间时，处理方式为（  D ）。
A.Gray = 0.3*R + 0.4*G + 0.3*B
B.Gray = 0.2*R + 0.6*G + 0.2*B
C. Gray = 0.4*R + 0.3*G + 0.3*B
D. Gray = 0.299*R + 0.587*G + 0.114*B

21．	中级项目4中下载的MNIST数据集文件包括几个压缩文档？（ C  ）
A.2         B.3
C.4         D.5

22．	在Python中使用open()函数读取二进制文件时，第一个参数是文件名，第二个参数是（ D  ）
A.'bin'         B.'read_bin'
C.'b'         D.'rb'

23．	图片和标签是以固定结构存储在二进制文件中的，为了把图片和标签从文件内容缓冲区中读出来，我们主要使用Python的（  A ）包。
A.struct         B.pandas
C.numpy          D.OpenCV

24．	当前协程一般通过哪种方式让出CPU时间给其他协程？（  B ）
A.rawCapture.truncate(0)
B.await asyncio.sleep(10)
C.await rawCapture.truncate(0)
D.rawCapture.sleep(10)

25．	在语句res = YanAPI.sync_do_voice_asr_value()中，res是什么？（  B ）
A.列表
B.字典
C.元组
D.字符串

26．	语句res = YanAPI.sync_do_voice_asr_value()之后，如何表示机器人识别到的内容？（ A  ）
A.res["question"]
B.res("question")
C.res("answer")
D.res["answer"]

27．	语句res = os.popen(‘./MobileNetSSD20 images/test.jpg’)的含义是什么？（  C ）
A.打开两个文件：MobileNetSSD20和test.jpg。
B.使用MobileNetSSD20去打开test.jpg图片文件。
C.调用shell命令，这个命令的意思是用训练好的mobileNet模型识别test.jpg图片中的对象。
D.打开test.jpg图片文件。

28．	关于多个协程之间的相互配合，以下陈述错误的是？（  B ）
A.协程通过主动让出CPU时间给其他协程，使其他协程及时获得执行的机会
B.协程靠抢占式来获得CPU时间
C.协程之间可以通过全局变量来沟通
D.协程在完成任务后，可及时结束

29．	以下关于色彩空间的描述，错误的是？（ C  ）
A.HSV中的H是以圆锥顶面的半径扫过的角度来度量的，红色为0°
B.从BGR色彩空间转换到Gray色彩空间是不可逆的
C.图像无法从HSV色彩空间转换到Gray色彩空间
D.HSV中的V指的是人眼感受到的光的明暗程度

30．	在智能人形机器人上的Raspberry Pi安装的操作系统是什么？（  C ）
A.Ubuntu
B.红旗Linux
C.Raspbian
D.Windows CE

31．	彩色CCD的下层结构是什么？（ C  ）
A.增光镜片
B.色块网格
C.感应线路
D.微型镜头

32．	关于CCD分色方式的描述，错误的是？（ B  ）
A.CCD有两种分色方式：RGB原色分色法和CMYG补色分色法
B.目前CMYG补色分色法占优势
C.补色CCD可以容忍较高的感度
D.由于影像处理引擎的技术和效率进步，目前原色CCD占优势

33．	以下哪个模块不属于OpenCV？（   D）
A.core
B.imgproc
C.features2d
D.cpu

34．	关于掩码图像，以下表述错误的是（ B  ）
A.掩码图像一般是二值图像。
B.掩码图像的作用是掩盖原图像。
C.原始图像中和掩码图像的0值区域对应的部分被遮盖。
D.原始图像中和掩码图像的255值区域对应的部分被暴露。

35．	关于语句cv2.blur(res, (5,5))，表述错误的是？（ C  ）
A.此语句对res图像数据做均值滤波
B.此语句采用的卷积核的尺寸是(5,5)
C.此语句对res图像数据做Sobel滤波
D.此语句采用的卷积核的每一个元素的值均为1/25。

36．	关于cv2.findContours()，下列表述错误的是？（ D  ）
A.该函数处理的图像必须是二值图。
B.根据版本的不同，该函数有可能返回两个结果，也有可能返回三个结果。
C.该函数返回的轮廓是由点构成的。
D.该函数处理的图像可以是灰度图。

37．	Joblib.load（）函数的作用是（ A  ）
A.加载模型
B.训练模型
C.保存模型
D.评估模型

38．	使用KNN算法实现手写数字识别，属于（  D ）。
A.无监督学习
B深度学习
C强化学习
D有监督学习

39．	cv2.cvtColor（）的作用是（ B  ）。
A.二值化
B.图像颜色模型转换
C.读取图片数据
D.尺寸规范化

40．	在识别绿色球体的项目中，我们如何确认识别到了绿色球体？（B   ）
A.识别到绿色块
B.识别到绿色块，且其轮廓点数超过给定的阈值
C.识别到绿色块，且其轮廓点数小于给定的阈值
D.识别到绿色块，且其轮廓是圆形

41．	智能服务机器人技术与以下哪门学科关系不大？（  D ）
A.机械学科
B.电子学科
C.计算机学科
D.体育学科 

42．	以下哪类机器人不属于公共服务机器人？（  C ）
A.引导接待机器人
B.智能安防机器人
C.医疗康复机器人
D.末端配送机器人

43．	舵机的参数是用来判断舵机性能高低的标准。舵机参数不包括（ DB  ）。
A.转动范围
B.最大转矩
C.最大转动速度
D.极限位置

44．	空间中点的齐次坐标采用（  B ）个元素的列阵来表示。
A.2
B.3
C.4
D.5

45．	当机器人关节为移动关节，其关节变量为（  C ）。   
A.连杆长度
B.连杆距离
C.连杆转角
D.连杆扭角


46．	机器人运动学正问题是（  A ）。   
A.已知关节变量求取末端位姿
B.已知末端位姿求取关节变量
C.已知关节力求取末端位姿
D.已知末端位姿求取关节力

47．	当机器人关节为转动关节，其关节变量为（ C  ）。
A.连杆长度
B.连杆距离
C.连杆转角
D.连杆扭角

48．	机器人视觉中使用的轮廓检测函数为（  A ）。
A.cv2.findContours  B.cv2.erode  
C.cv2.ellipse      D.cv2.cvtColor

49．	下列哪个参数不是轮廓检测函数使用的常用参数( B  )。
A.image  B.kernel  C.mode  D.method

50．	机器人追踪目标物体，需要调用（  D ）次机器人追踪函数track_thread。
A.1          B.3
C.5          D.重复调用

51．	下列关于机器人追踪目标物体的说法错误的是 (  C )。
A.需要事先定义好画布大小和中心点坐标                          
B.需要事先定义好各种颜色的队列范围，以方便后续更改
C.需要事先定义好机器人的移动方法，即左右前后的预设计 
D.需要进行机器人获取的初始图像的预处理

52．	颜色追踪中，机器人识别出目标物体后，draw_frame函数的意义为（  B ）。
A.画出目标物体的轮廓             B.通过画一个圈，将感兴趣的地方标注出来
C.画出目标物体的背景框架         D.画出图像中所有类似目标物体的框架

53．	如果用人体器官比喻机器人的机器视觉系统，下列哪项更符合（ A  ）。
A.眼睛        
B.耳朵
C.四肢        
D.躯干

54．	机器人的目标物体轮廓探测过程中，findCoutours方法的RETE_EXTERNAL参数表示（ D  ）。
A.建立一个等级树结构的轮廓         
B.建立两个等级的轮廓
C.只检测内控的边界        
D.只检测外轮廓

55．	关于机器人追踪目标物体的过程，下面说法错误的是（ B  ）。
A.项目中机器人可以对物体进行成功追踪的一个必要前提是目标物体不能运动过快              
B.目标物体如果消失在机器人视野中，机器人不可以通过360度巡视，重新发现目标
C.机器人左右转弯较为吃力，需要克服较大摩擦力实现     
D.可以通过调整左右转弯的参数repeat来克服机器人转弯吃力的问题

56．	（ A  ）是找到机器人本身回到过已访问的场景的过程，并为后端优化提供约束。
A. 回环检测    B.扫描匹配       C.运动更新    D.场景匹配       
    
57．	Navigation中保存地图的软件包是（ D  ）。
A.AMCL  B. map_saver  C. robot_map   D. map_server                         

58．	move_base节点默认的输出信息是（ B  ）。
A.位置  B. 速度  C. 速度+位置+轨迹   D.轨迹              

59．	查看当前有哪些topic，应使用哪些指令（B   ）。
A.rostopic show  B. rostopic list  C. rostopic ls   D. rostopic show -a                    

60．	自适应蒙特卡罗定位，是机器人在2D移动过程中的概率定位系统，该系统采用（A   ）来跟踪已知地图中的机器人位姿。
A 粒子滤波器   B GPS定位   C.节点      D.惯导定位

61．	机器人在获得目的地（goal）信息后，首先经过_________，规划出一条大致可行的路线，然后调用_________，根据这条路线以及代价地图（costmap）的信息，负责局部避障的规划，最后将数据发送给机器人，实现其自主导航的功能。 （A   ）         
A 全局路径规划器         局部路径规划器 
B 局部路径规划器         全局路径规划器
C 全局路径规划器         全局路径规划器
D. 局部路径规划器         局部径规划器

62．	ROS导航功能包中，（ A  ）节点是导航过程运动控制中的核心节点，在导航任务中处于核心位置，其他package都是它的插件。
A. move_base                          B. base_local_planner 
C.base_global_planner                   D. recovery_behavior
                                                          

63．	在复杂环境下，实现导航的三要素为：1）我在哪；2）我要去哪；3）如何去。前面两个问题主要围绕机器人的（ A  ）。
A即时定位与地图构建
B 避障与导航
C 路径规划
D 智能语音
                                                  

64．	在复杂环境下，实现导航的三要素为：1）我在哪；2）我要去哪；3）如何去。如何去主要依赖机器人的（ B  ）。
A定位与地图构建
B 避障与导航
C 自动控制系统
D 智能语音
                                                 

65．	KartoSLAM算法是基于图优化的思想，图中的节点表示（ A  ）
A 机器人轨迹的一个位置点和传感器测量数据集
B 位姿间的空间约束关系
C 机器人的运动轨迹点
D 机器人位姿点                                             

66．	KartoSLAM算法是基于图优化的思想，图中的边表示（  B ）
A 机器人轨迹的一个位置点和传感器测量数据集
B 位姿间的空间约束关系
C 机器人的运动轨迹点
D 机器人位姿点

67．	‏Navigation中保存地图的软件包是（ A  ）。
A.map_server                           B.AMCL
C.robot_map                            D.map_saver

68．	ABB机器人属于哪个国家？（  C ） 
A.美国 B中国 C瑞典 D日本

69．	安川机器人属于哪个国家？ （ A  ） 
A日本 C挪威 C俄罗斯 D 美国

70．	手部的位姿是由（ B ）构成的。 
A. 位置与速度    B. 姿态与位置   C. 位置与运行状态    D. 姿态与速度

71．	运动学主要是研究机器人的（ B  ）。
A. 动力源是什么             B. 运动和时间的关系 
C. 动力的传递与转换         D. 运动的应用

72．	机器人轨迹控制过程需要通过求解（ B  ）获得各个关节角的位置控制系统的设定值。
A. 运动学正问题                        B. 运动学逆问题    
C. 动力学正问题                        D. 动力学逆问题

73．	一个刚体在空间运动具有（ D  ）自由度。
 A．3个           B．4个           C．5个            D．6个

74．	对于转动关节而言，关节变量是D-H参数中的（ A  ）。
A．关节角      B．杆件长度       C．横距      D．扭转角

75．	运动正问题是实现如下变换（ A  ）。
A．从关节空间到笛卡尔空间的变换       B．从操作空间到迪卡尔空间的变换
C．从迪卡尔空间到关节空间的变换     D．从操作空间到关节空间的变换

76．	运动逆问题是实现如下变换（  C ）。
A．从关节空间到操作空间的变换        B．从操作空间到迪卡尔空间的变换
C．从迪卡尔空间到关节空间的变换      D．从操作空间到任务空间的变换

77．	动力学的研究的是将机器人的（  A ）联系起来。
A．运动与控制                           B．传感器与控制
C．结构与运动                           D．传感系统与运动

78．	对于移动（平动）关节而言，关节变量是D-H参数中的（ C  ）。
A．关节角      B．杆件长度        C．横距     D．扭转角

79．	URDF创造的机器人模型包含：环节（link）、（  C  ）、运动学参数（axis）、动力学参数（dynamics）、可视化模型（visual）、碰撞检测模型（collision）。
A．坐标系
B．框架
C．关节
D．基座

80．	操作机手持粉笔在黑板上写字，在（ C  ）方向只有力的约束而无速度约束？
A．X轴         B．Y轴         C．Z轴         D．R轴

81．	物体在三维空间有（  D ）个自由度。
A、3
B、4
C、5
D、6

82．	物体在三维空间中，水平移动的自由度有（  A ）个。
A、3
B、4
C、5
D、6

83．	物体在三维空间中，旋转移动的自由度有（ A  ）个。
A、3
B、4
C、5
D、6

84．	移动关节允许两相邻连杆沿关节轴线做相对移动，这种关节具有（ A  ）个自由度
A、1
B、2
C、3
D、4

85．	转动关节允许两相邻连杆绕关节轴线做相对转动，这种关节具有（ A  ）个自由度。
A、1
B、2
C、3
D、4

86．	球面关节具有（ C  ）个自由度。
A、1
B、2
C、3
D、4

87．	右手坐标系法则中，大拇指指向的是（  A ）。
A、X轴正方形
B、Y轴正方形
C、Z轴正方形
D、原点

88．	ROS melodic最佳适配的Linux版本是（ D  ）。
A CentOS 7                                   B Ubuntu 14.04
C Ubuntu 16.04                               D Ubuntu 18.04       
                                                      

89．	机器人操作系统的全称是（ D  ）。
A React Operating System
B Router Operating System
C Request of Service
D Robot Operating System                                     

90．	用于管理ROS package依赖项的命令行工具是（ A  ）。
A rosdep                                  B rosls
C rospack                                 D roscd
  

91．	用于管理节点的启动与停止的ROS命令是（ C  ）。
A rosdep                                 B rosls
C roslaunch                               D rospack
 

92．	ROS提供的package管理的工具是（ C  ）。
A rosdep                                  B rosls
C rospack                                 D roscd
 

93．	ROS提供的直接切换工作目录到某个软件包或者软件包集当中的命令是（ D  ）。
A rosdep                                  B rosls
C rospack                                 D roscd
 

94．	ROS提供的检查功能包系统依赖是否安装的命令是（ A  ）。
A. rosdep check <stacks-and-rospackages>      B rosdep install <stacks-and-rospackages>
C. rosdep keys <stacks-and-rospackages>       D. rosdep resolve <rosdeps>
 

95．	ROS提供的安装功能包系统依赖的命令是（  B ）。
A. rosdep check <stacks-and-rospackages>      B rosdep install <stacks-and-rospackages>
C. rosdep keys <stacks-and-rospackages>       D. rosdep resolve <rosdeps>
 
96．	ROS提供的直接按软件包的名称显示该目录下所有文件名称的命令是（  B ）。
A rosdep                                  B rosls
C rospack                                 D roscd      

97．	ROS提供的运行某个包下可执行文件的命令是（ D  ）。
A. rosdep check <stacks-and-rospackages>      
B rosdep install <stacks-and-rospackages>
C. rosdep keys <stacks-and-rospackages>          
D. rosrun <package> <executable>
 
98．	在机器人建图过程中，控制机器人在实验场地移动的工具是（ B  ）。
A rviz                                      B Teleop
C Gazebo                                    D.OpenCV                      

99．	ROS提供的一个非常强大的机器人可视化工具是（ A  ）。
A rviz                                      B Teleop
C Gazebo                                    D.OpenCV                      

100．	在机器人建图过程中，使用Teleop工具发布速度控制命令时，控制机器人直行的指令是（ B  ）。
A u                                        B  i 
C k                                        D.  l                            

参考答案：
1-5:BABDB  6-10:DABCA  11-15:CCDAB  16-20: CCABD   21-25：CDABB
26-30：ACBCC  31-35：CBDBC  36-40：DADBB  41-45：DCDBC  46-50：ACABD  
51-55：CBADB  56-60：ADBBA   61-65：AAABA  66-70：BACAB  71-75：BBDAA  
76-80：CACCC  81-85：DAAAA  86-90：CADDA  91-95：CCDAB  96-100：BDBAB




 
二、多选题（100题）
1.	按照控制电路的不同，舵机可以分为（  CD  ）。
A.金属齿舵机          
B.副翼舵机    
C.模拟舵机            
D.数字舵机
2.	常见的无损压缩音频格式有（ ABCD   ）。
A.WAV         B.PCM       C.ALS       D.ALAC
3.	语音识别中会用到以下哪几种模型（  BCD  ）。
A．神经网络模型     B．声学模型 
C．语音字典         D．语言模型
4.	Sphinx采用了（  BC  ）的统计语言概率模型
A.一元语法    B.二元语法
C.三元语法    D.四元语法
5.	语音交互的主要研究方向集中于（ ABD   ）。
A.语音合成
B.语音识别
C.语音感知
D.语义理解
6.	语音合成中，首先需要对文本进行语言学分析，具体步骤包括（  ACD  ）。
A.将输入的文本规范化，处理用户较可能出现的拼写错误，并删除不规范和无法发音的字符
B. 将输入的语音文本按一定模式进行分类，进而依据判定找出最佳匹配结果
C. 分析文本里的词和短语的边界，确定读音，同时分析数字、姓氏、特殊字符以及多音字的读法    
D.确定语气变换及不同音的轻重读法，最后将文字转换成计算机可以处理的信号，传送到下一步
7.	语音合成在（ ABCD   ）等多个领域提供了完整的自然语言交互解决方案。
A.公益       B.教育、陪伴
C.游戏娱乐   D.智能家居
8.	eSpeak的特性有（BCD    ）。
A.真实平滑  B.清晰  C.快速  D.音位编码
9.	可以通过对eSpeak参数的调整来改变机器人的发声的（  ABC  ）。
A.音色
B.音量
C.速度
D.传播速度
10.	eSpeak的命令中，可以添加的参数有（ ABCD   ）。
A.-a    B.-s    C.-k    D.-p
11.	下面espeak命令说法正确的是（ CD   ）。
A.参数用一横说明后面的参数是单词     
B.参数用两横表示后面的参数是字符     
C.参数前有横线是System V风格    
D.参数没有横是BSD风格
12.	下面哪些不是用于进行语音识别的工具包（  BCD  ）。
A.CMU Pocketsphinx         B.eSpeak
C.YanAPI                   D.RestfulAPI
13.	下列哪些是Yanshee在进行颜色追踪、运动控制的过程中，需要进行的操作（ ABCD   ）。
A.循环抓拍摄像头前面的事物图象
B.识别图象中的目标物体
C.根据目标物体在图象中的位置，半径大小，进行方向和远近距离的调整
D.到了合适的距离，执行抱球动作
14.	关于机器人的摄像头拍摄线程核心cv2模块需要用到的是（ ABCD   ）。
A.circle           
B.inRange
C.erode         
D.findContours
15.	关于cv2模块的circle函数，下面说法正确的是（ ABD   ）。
A.radius是圆的半径大小
B.thickness是轮廓线条粗细
C.image是圆图象的位置
D.center_coordinates是指圆的中心坐标
16.	关于cv2模块的GaussianBlur函数，下面说法错误的是（  BCD  ）。
A.该函数为高斯平滑滤波函数           
B.image参数是目标图像的位置
C.size参数是图象大小       
D.SD是均方差
17.	在机器学习中，模式识别是将标签分配给给定的输入值。模式识别主要包括（  AC  ）。
A.分类          B.标定
C.回归          D.标注
18.	OCR（Optical Character Recognition）即光学字符识别技术，它是模式识别的一个分支，按字体分类它主要分为( CD   )。
A.西文字体识别           
B.中文字体识别
C.印刷体识别       
D.手写体识别
19.	MNIST数据集包括的压缩文件有哪些？（ ABCE   ）
A.train-images-idx3-ubyte.gz           
B.train-labels-idx1-ubyte.gz
C.t10k-images-idx3-ubyte.gz         
D.t10k-images.idx3-ubyte.rar
E.t10k-labels-idx1-ubyte.gz
F.t10k-labels-idx1-ubyte.rar
20.	MNIST数据集中，数字1图片的标记包括哪两种？（ BC   ）
A.2           
B.[0,1,0,0,0,0,0,0,0,0]
C.1       
D.[1,0,0,0,0,0,0,0,0,0]
21.	关于struct.pack_into(‘>B H I 5s’,buffer,0,10,18,288,b’hello’)语句，正确的描述包括（  ABCD  ）
A.该语句使用struct包中的pack_into函数向buffer中写入数据
B.该语句的第一个参数是控制格式
C.通过该语句写入buffer的数据分别是1位无符号整数、2位无符号短整数、4位无符号整数和长度为5的字符串
D.控制格式中的’>’表示big-endian
22.	关于语句struct.unpack_from(‘>B H I 2s’, buffer, 0)，正确的是（ ABC   ）
A.该语句的含义是使用struct包中的unpack_from函数将真实数据从buffer中解包出来
B.‘>B H I 2s’是控制格式
C.最后一个参数0指偏移量
D.控制格式采用的字节序是little-endian
23.	关于语句index+=struct.calcsize(‘>II’)，下述表述正确的是（  AC  ）
A.struct.calcsize('>II')表示计算格式串'>II'所代表的长度
B.struct.calcsize('>II')的结果是6
C.struct.calcsize('>II')的结果是4
D.控制格式采用的字节序是little-endian
24.	关于语句temp=struct.unpack_from(‘>784B’,buf,index)，表述正确的是（ ABC   ）
A.该语句用于从buf中读取784字节的数据到变量temp中
B.784字节的数据代表了一张28*28的图片的数据
C.参数3：index代表偏移量
D.参数2：buf表示接收结果数据的变量
25.	关于Python中的append和extend，表述正确的是（  BCD  ）
A.两者作用效果一模一样
B.append命令是将整个对象追加在列表末尾
C.extend命令是将新对象中的元素逐一追加在列表的末尾
D.extend命令只能添加可迭代对象
26.	关于语句img = cv2.imread(load_path)，表述正确的是（ BCD   ）
A.因为load_path是一副灰度图片，所以img结果是单通道的
B.img结果是三通道的
C.上述语句中，默认的第二个参数是cv2.IMREAD_COLOR
D.上述语句中，默认的第二个参数如果是-1，即表示不改变原图的模式，
27.	关于sklearn库，下列表述哪些是正确的（ABCD    ）
A.Sklearn全称是scikit-learn
B.Scikit-learn最初是由David Cournapeau在2007年作为谷歌夏季代码项目开发的
C.sklearn库是建立在SciPy库（科学计算库）的基础上的，因此在使用sklearn之前必须安装scipy库
D.Sklearn通过Python语言中一致的接口提供了一系列有监督和无监督的学习算法
28.	关于sklearn、pandas、numpy和scipy库，下列表述正确的是（ACD    ）
A.sklearn库要以SciPy为基础来安装
B.sklearn库要以pandas为基础来安装
C.准备和预处理阶段对数据的加载、操作和汇总可使用NumPy库和pandas库
D.sklearn库专注于数据建模
29.	以下哪些模块是sklearn库提供的？（ ABCDE   ）
A.聚类（Clustering）
B.交叉验证（Cross Validation）
C.降维（Dimensionality Reduction）
D.特征选择（Feature selection）
E.有监督学习模型（Supervised Models）
30.	关于KNeighborsClassifier分类器，以下表述正确的是（ ABD   ）
A.KNeighborsClassifier采用的算法是K Nearest Neighbor算法
B.KNeighborsClassifier依据k个对象中占优的类别进行决策
C.KNeighborsClassifier分类器的分类结果不受k取值的影响
D.KNN算法，其中的K表示与自己最接近的K个数据样本
31.	dump(value, filename, compress=0, protocol=None, cache_size=None)中的filename的扩展名取以下哪些扩展名时将启动自动压缩方法？（ ABCDE   ）
A.‘.z’  B.‘.gz’  C.‘.bz2’  D.‘.xz’  E.‘.lzma’
32.	进行模型测试时，需要准备好哪些条件？（ ABC   ）
A.模型文件
B.测试集图片文件
C.测试集标签文件
D.训练集图片文件
E.训练集图片标签文件
33.	语音识别和对象检测技术的组合应用，能够提供以下哪些特性？（ ABCD   ）
A.高质量用户体验   B.安全性和低成本
C.工作效率提升     D.可挖掘的数据
34.	查看yanshee机器人中的程序，有哪几种方案？（ AD   ）
A.使用vnc软件
B.使用VGA线连接显示器，配备键盘鼠标
C.盲操作
D.使用高清线连接显示器，配备键盘鼠标
35.	关于YanAPI，以下表述正确的是？（  BD  ）
A.YanAPI是基于Yanshee Helpful接口开发的
B.YanAPI是基于Yanshee RESTful接口开发的
C.YanAPI是基于C++语言的
D.YanAPI是基于Python语言的
36.	为了在Python程序中使用YanAPI，我们需要做哪些事？（CD    ）
A.将YanAPI文件拷贝到笔记本电脑的C盘根目录
B.在机器人本体安装Python 2.7
C.当需要在机器人本体运行时，需将YanAPI文件拷贝到机器人 /usr/local/lib/python3.5/dist-packages/ 目录下
D.在程序中引入，如：import YanAPI
37.	关于进程、线程和协程，以下表述正确的是？（ ACD   ）
A.线程开销较小，而进程开销较大。
B.协程类似于进程，但协程是协作式多任务的。
C.协程类似于线程，但协程是协作式多任务的，而线程是抢占式多任务的。
D.线程的创建较为容易，进程需要复制其父进程。
38.	在Python程序中，如何使用进程和线程？（  AC  ）
A.可以使用 multiprocessing.Process 来实现进程
B.可以使用 multiprocessing.Process 来实现线程
C.可以使用 threading.Thread 来实现线程
D.可以使用 threading.Thread 来实现协程
39.	关于mobileNet模型，以下表述正确的是？（ ACD   ）
A.mobileNet是深度学习领域一种比较具有代表性的轻量级神经网络
B.mobileNet是微软公司提出的
C.mobileNet是谷歌公司提出的
D.移动设备由于硬件和算力的限制，适于采用mobileNet这种轻量级的神经网络模型
40.	以下哪些应用场景是mobileNet在移动端实现的？（ ABCD   ）
A.图像识别					B.图像分类
C.人脸属性识别				D.人脸识别
41.	关于Python的Queue模块，以下说法正确的是？（ABD    ）
A.Queue模块主要是是用来实现进程间的通行。
B.Queue模块的先进先出队列实现了第一个加入的任务，第一个取出。
C.Queue模块的后进先出队列实现了第一个加入的任务，第一个取出。
D.Queue模块的优先级队列实现了最小值第一个被取出。
42.	机器人运动学逆问题可用以（  BD  ）。
A.求取机器人末端位姿			 B.求取机器人关节变量
C.求取机器人工作空间			 D.用以实现机器人控制
43.	 齐次矩阵可用以描述（  ABCD  ）。
A.一个坐标系相对于另一个坐标系的位姿
B.刚体在空间中的位姿
C.刚体的一系列运动
D.关节与末端位姿的变换关系
44.	 机器人关节变量一般为（BC    ）。
A.连杆长度					 B.连杆距离
C.连杆转角					 D.连杆扭角
45.	 机器人连杆参数包括（ ABCD   ）。
A.连杆长度
B.连杆距离
C.连杆转角
D.连杆扭角
46.	 机器人运动学问题可用以（ ABCD   ）。
A.求取机器人末端位姿
B.求取机器人关节变量
C.求取机器人工作空间
D.用以实现机器人控制
47.	 cv2模块的inRange函数可以去除背景颜色，下面关于其参数说法正确的是（  BC  ）。
A.图像中像素值高于lower_red的像素，图像像素值变为0     
B.图像中像素值低于lower_red的像素，图像像素值变为0     
C.图像中像素值高于upper_red的像素，图像像素值变为0     
D.图像中像素值低于upper_red的像素，图像像素值变为0
48.	下列关于cv2.erode(src, kernel[, dst[, anchor[, iterations[, borderType[, borderValue]]]]])函数，说法正确的是（ BCD   ）。
A.该函数是图像膨胀操作，属于图像形态学操作  
B.函数的src参数代表输入图片  
C.函数的kernel参数代表方框的大小  
D.函数的iteration代表迭代的轮数
49.	下列关于cv2.dilate(src, kernel[, dst[, anchor[, iterations[, borderType[, borderValue]]]]])函数，说法错误的是( ABD   )。
A.该函数是图像腐蚀操作  
B.函数的kernel参数代表中心点
C.该函数是图像膨胀操作  
D.该函数不可以设置iteration参数
50.	下面哪些函数是机器人图像处理中经常用到的函数（ BCD   ）。
A.cv2.cvtColor              B.cv2.findContours
C.cv2.GaussianBlur          D.cv2.rectangle
51.	下面哪些是机器人轮廓检测方法findContours的检索模式( ABCD   )。
A.cv2.RETR_EXTERNAL      	B. cv2.RETR_LIST
C.cv2.RETR_CCOMP          	D. cv2.RETR_TREE
52.	颜色追踪项目中，需要用到的线程有（  CD  ）。
A.目标定位线程           	B.任务启动线程
C.图像采集线程           	D.机器人跟踪线程
53.	颜色追踪项目中，图像帧采集线程主要的步骤包括（ ABCD   ）。
A.设置目标颜色的队列范围        
B.进行高斯滤波等一系列图像预处理操作
C.获取图像中目标物体的颜色        
D.计算该物体中心坐标和半径
54.	颜色追踪项目中，机器人追踪线程主要的步骤包括（ ABD   ）。
A.计算目标的左右位置并进行方向调整         
B.计算目标的远近位置并进行距离调整
C.等待延时后，执行抱球操作        
D.等待延时后，如果判断发现方向和远近均达到指定值，则执行抱球操作
55.	机器人视觉和运动控制相结合需要改进的地方是（ ABCD   ）。
A.简化个线程之间的数据流动      B.提高通讯速度
C.提高数据处理速度              D.机器人的材料研究
56.	KartoSLAM算法的基本流程包含（ ABCD   ）。
A.运动更新                      B.扫描匹配
C.回环检测                      D.后端优化
57.	Timed Elastic Band（TEB）路径规划算法的核心思想，是通过加权多目标优化模型，获取最优路径。它的目标约束函数主要涉及：（ ABCD   ）。
A.跟踪全局路径                  B.避开障碍物约束
C.速度和加速度约束              D.机器人自身的运动学限制
58.	代价地图（costmap）用于描述环境中的障碍物信息，基础的分层代价地图包含有：（ ABC   ）。
A.静态地图层    		B. 障碍物层  		C. 膨胀层 		D. 基础层             
59.	A*算法运用两个列表，分别是（  AB  ）。
A .open list  			
B. close list 	 		
C. node list 		 
D. search list       
60.	在机器人自主导航任务的任务准备环节中，需要完成的工作包括（ ABCD   ）。 
A.机器人及笔记本电脑处于同一网络下远程连接，且连接互联网正常；
B.检查机器人急停开关，若急停开关被按下，需将其旋开；
C.准备自主导航任务所需的实验场地以及相应的地图文件；
D.准备电脑端所需的软件环境。
61.	 在可视化界面rviz中进行重定位的方式包含有：（  AB  ）。
A .局部重定位    			B.全局重定位      
C. GPS重定位     			D.惯导系统重定位
62.	 局部规划器：为局部代价地图，记录机器人附近的障碍物信息，通常由传感器实时刷新，用于局部路径规划。可选算法插件包括（ AB   ）。
A.  base_local_planner         B .  dwa_local_planner 
C.  parrot_planner            	 D.  navfn
63.	base_global_planner全局规划器：为全局代价地图，记录整个地图上的障碍物信息，用于生成全局路径。可选算法插件包括：（ ABC   ）。
A. parrot_planner             B. navfn
C.global_planner:             D. dwa_local_planner
64.	当机器人无法规划出导航路径时，由recovery_behavior提供如清除局部代价图，尝试转圈寻找路径等策略，它包含：（  ABC  ）。
A. clear_costmap_recovery: 实现了清除代价地图的恢复行为。
B. rotate_recovery: 实现了旋转的恢复行为。
C. move_slow_and_clear: 实现了缓慢移动的恢复行为。
D. navfn   
65.	rviz是ROS提供的一个非常强大的机器人可视化工具。利用rviz可以很方便地查看ROS导航功能包集发布的可视化数据。启动rviz后，界面主要包括 （ABCD    ）。
A.工具栏：提供视角控制、目标设置、发布地点等工具。
B.显示项列表：用于显示当前选择的显示插件，配置每个插件的属性。通过点击Add按钮，可以订阅感兴趣的话题和显示类型，并在中间的显示区域中显示出来。
C.视角设置区：选择多种观测视角；
D.时间显示区：显示当前的系统时间和ROS时间。
66.	KartoSLAM算法的主要特点包括：（  ABCD  ）。
A.	算法较轻量级，运行配置难度低，
B.	使用里程计进行位姿预测，适合轮式机器人，
C.	基于图优化，具有回环检测功能，
D.	能在较大场景使用。       
67.	为了解决机器人的绑架问题，AMCL在蒙特卡洛方法基础上添加（ AB   ）。
A. 自适应的粒子数调整    	 B. 随机撒粒子机制   
C. 定时重启功能       		 D. 差分定位技术
68.	 ROS-Navigation导航功能包包含完成机器人（ ABC   ）等组件。
A. 定位   	   B. 路径规划 		   C. 导航       	D. SLAM  
69.	关于多个协程之间的相互配合，以下陈述正确的是？（  ACD  ）。
A.	协程通过主动让出CPU时间给其他协程，使其他协程及时获得执行的机会
B.	协程靠抢占式来获得CPU时间
C.	协程之间可以通过全局变量来沟通
D.	协程在完成任务后，可及时结束
70.	机器人操作系统ROS全称以下错误的是：（ ABC   ）。
A.	Router Operating Sytem
B.	Request of Service
C.	React Operation System
D.	Robot Operating System
71.	 ROS Kinetic和下面版本哪些不匹配：（  ABD  ）。
A.	CentOS
B.	Ubuntu 14.04
C.	Ubuntu 16.04
D.	Ubuntu 18.04
72.	 下列哪些是ROS的特点（ BCD   ）。
A.	强实时性
B.	分布式结构
C.	开源
D.	模块化
73.	 ROS Kinetic安装命令以下哪些是错误的：（ BCD   ）。
A.	sudo apt-get install ros-kinetic-desktop-full
B.	sudo apt-get-install ros kinetic-desktop-full
C.	sudo apt-get install Ros-Kinetic-Desktop-full
D.	sudo apt-get install ROS-Kinetic-Desktop-full
74.	 关于ROS的诞生地，以下哪些是错误的：（ ACD   ）。
A.	麻省理工学院
B.	斯坦福大学
C.	卡内基梅隆大学
D.	加州大学伯克利分校
75.	Gazebo是一款什么工具？（ ABD   ）。
A.	仿真
B.	调试
C.	命令行
D.	可视化
76.	在使用激光雷达扫图过程中，注意事项包括：（  ACD  ）。
A.	最好选取附近环境比较独特、相似度较低的位置开始扫图。
B.	建议在相似度较高的地方开始，如平整的长走廊等。
C.	在一个存在多个分区的环境中，尽量选取环形路线（走之前走过的路线），有助于地图回环。
D.	地图中存在多个环形路线，应当先走小环路线，再走大环路线。
77.	/slam_karto节点订阅的话题（topic）包括：（  AB  ）。
A.	/scan 节点发布的激光数据
B.	/tf 里程计数据，由tf转换关系表示
C.	/map 创建的地图
D.	/visualization_marker_array:建图算法中的图网络           
78.	/slam_karto节点发布的话题（topic）包括：（  BCD  ）。
A.	/scan 节点发布的激光数据
B.	/tf 输出地图坐标系到里程计坐标系的变换（map->odom）
C.	/map 创建的地图
D.	/visualization_marker_array:建图算法中的图网络   
79.	在开始机器人建图项目前，需要完成的项目准备工作包括：（ABCD    ）。
A.	检查机器人急停开关，若急停开关被按下，需将其旋开； 
B.	一台配置有Ubuntu 18.04 +ROS melodic环境或虚拟机环境的电脑； 
C.	电脑和机器人处于同一局域网网段，且网络连接正常； 
D.	实验场地没有影响或遮蔽激光雷达探测的障碍物。 
80.	机器人建图任务最终生成的地图文件包含：（ AB   ）。
A.map.pgm    B.map.yaml
C.map.jpg     D.map.png
81.	移动机器人定位与导航的流程包括：（ ABCD   ）。
A. 首先获得相关的地图信息（map）和机器人目标点位姿（goal），并结合传感器数据，如激光数据（scan）与里程计数据（odom）；
B. 从初始位置到目标位置的角度考虑，调用全局路径规划器（global planner），规划出一条大致可行的路线；
C. 在地图中出现了未知的障碍物的情况下，调用局部路径规划器（local planner），并根据代价地图（costmap）的信息，规划局部避障的路线；
D. 发送规划的路线数据到机器人底层控制，让机器人沿着路线运动。
82.	 TEB算法的目标函数主要涉及：（    ）。
A. 跟踪全局路径 
B. 避开障碍物约束;
C. 速度和加速度约束
D. 机器人自身的运动学限制
83.	 AMCL节点订阅的话题（topic）包括：（  ABCD  ）。
A.	/tf (tf/tfMessage)：坐标转换;
B.	/scan（sensor_msgs/LaserScan）：激光数据；
C.	/initialpo（geometry_msgs/PoseWithCovarianceStamped）：初始位置和均值和方差；
D.	/map（nav_msgs/OccupancyGrid）：地图信息。
84.	AMCL节点发布的话题（topic）包括：（ ABC   ）。
A.	./amcl_pose（geometry_msgs/PoseWithCovarianceStamped）：机器人在地图中的位姿估计，包括估计方差；
B.	/particlecloudpoint（geometry _msgs/PoseArray）：滤波器估计的位置； 
C.	/tf（tf/tfMessage）：发布从odom到map的转换位置。
D.	/map（nav_msgs/OccupancyGrid）：地图信息。
85.	 AMCL节点的服务包括：（  ABC  ）。
A.	Gloval_localization（std_srvs/Empty）：初始化全局定位，所有粒子完全随机分布在地上； 
B.	 Request_nomotion_update（std _ srvs / Empty）：手动更新粒子并发布更新后的粒子； 
C.	 Static_map（nav_msgs/GetMap）：AMCL调用此服务接收地图，用于基于激光扫描的定位。
D.	 /map：创建的地图； 
86.	在rviz界面下进行局部重定位，操作包括：（ ABC   ）。
A.	判断初始状态下机器人位姿是否准确，比如判断机器人的真实位置与在地图中的位置是否差异很大，并且图中目前激光数据是否与地图中的障碍物重合； 
B.	点击界面上方的“2D Pose Estimate”进行定位：我们大概找到一个机器人所在的真实位置，在地图中按下鼠标并往机器人正面朝向的方向拖出箭头，这就确认了机器人的位姿； 
C.	然后我们就会看到界面中的定位粒子群收敛，激光数据变动。  
D.	在机器人端开一个终端，执行：rosservice call /global_localization "{}"。
87.	Navigation Stack的主要功能有：（ BCD   ）。
A.	SLAM         	  
B.	定位
C.	路径规划          
D.	代价地图
88.	 SLAM可能会用到下列哪些传感器：（  ABCD  ）。
A.	二维激光雷达        
B.	RGBD深景相机
C.	里程计              
D.	红外
89 运动学研究的问题，以下描述是正确的有：（  ABD  ）。
A.	机械手在空间中的运动和关节的运动之间关系的科学
B.	已知手的运动，求解关节的运动
C.	已知倒立摆，求解关节的运动
D.	已知关节的运动，求解手的运动
90 机器人位姿的表述，以下哪些是正确的？（  AD  ）。
A.	位置可以用一组3*1的矩阵来表示
B.	位姿可以用一组3*3的矩阵来表示
C.	位姿可以用一组3*3的矩阵加余弦来表示
D.	位姿可以用坐标轴余弦组成的3*3矩阵来表示
91 如图所示，两个坐标系用位姿表示以下哪些是错的：（    ）。
A.     B.  
C.      D.  
92工业机器人按照发展水平，分别经历了哪（ ABC   ）代？
A.	示教再现型机器人
B.	感知机器人
C.	智能机器人
D.	情感机器人
93 机器人的定义中，正确是（ ABCD   ）。
A. 具有人的形象     B．模仿人的功能     
C．像人一样思维     D．感知能力很强
94典型的全局路径规划方法有： （ ABC   ）。
A. Dijkstra算法      B．BFS算法        
C．A*算法          D．TEB planner
95 多线程锁机制解决了线程之间的读取顺序问题，其中包含（ACD    ）。 
A. 互斥锁          B．原子锁
C．递归锁          D．条件锁
96 机器人逆运动学求解有多种方法，以下错误的有哪些？（ ACD   ）。
A. 3       B. 2      C. 4      D. 5
97 人形机器人运动自由度数，以下不正确的有：（ ABC   ）。
A. 小于2个             B．小于3个
C．小于6个             D．大于6个
98 在机器人坐标系的判定中，我们用拇指的指向，以下哪些是错误的？（ ABD   ）
A. X轴    B. Y轴     C. Z轴   D. R轴
99 建完模型后导入到Gazebo中发现是倒立的，这是以下哪些因素造成的？（  BC  ）
A.	文件本来就是倒立的      
B.	材料太重，导致质心过高
C.	坐标系设置不对        
D.	ROS环境没有完全安装
100 Gazebo中导入建好模型的文件后缀名以下哪些是错误的？（  AB  ）
A. mod    B. gar   C. urdf   D. zip

参考答案：
1-5: CD，ABCD，BCD，BC，ABD         6-10:ACD，ABCD，BCD，ABC，ABCD  
11-15:CD，BCD，ABCD，ABCD，ABD    16-20:BCD，AC，CD，ABCE，BC
21-25：ABCD,ABC,AC,ABC,BCD          26-30：BCD,ABCD,ACD,ABCDE,ABD
31-35：ABCDE,ABC,ABCD,AD,BD         36-40：CD,ACD,AC,ACD,ABCD
41-45：ABD,BD,ABCD,BC,ABCD           46-50：ABCD,BC,BCD,ABD,BCD
51-55：ABCD,CD,ABCD,ABD,ABCD        56-60：ABCD,ABCD,ABC,AB,ABCD
61-65：AB,AB,ABC,ABC,ABCD            66-70：ABCD,AB,ABC,ACD,ABC
71-75：ABD,BCD,BCD,ACD,ABD           76-80：ACD,AB,BCD,ABCD,AB
81-85：ABCD,ABCD,ABCD,ABC,ABC       86-90：ABC,BCD,ABCD，ABD，AD
91-95：BCD，ABC,ABCD，ABC，ACD     96-100：ACD，ABC，ABD，BC，AB

 
三、判断题（100题）
1.	无损的音频格式，解压时不会产生数据或质量上的损失，解压产生的数据与未压缩的数据完全相同。  (   )
2.	数字音频由于不压缩，通常比较大，不利于存储和传输。  (   )
3.	比特率越高音质越好，编码后的文件也越小。  (   )
4.	机器人语音技术的有损压缩，是因为有的声音是人听不到的，在音频压缩的时候，就去掉了人听不到的那些声音，以达到减少音频文件大小的目的。  (   )
5.	在需要反复存档、读档的工作上，音频的无损压缩比有损压缩技术更为适合。  (   )
6.	Pocketsphinx可以不依赖于SphinxBase，因此可以不用安装SphinxBase，也能直接使用Pocketsphinx。  ( F  )
7.	当我们进行较大场景的建图时，由于激光雷达累计误差的影响，走重复路径时机器人的位姿可能有一定的偏差，需要等待回环检测进行修正，以降低建图误差。( T  )
8.	决定语音感知的基本因素是共振峰，音色各异的语音共振峰模式是一样的。 (  F )
9.	共振峰合成器控制十分复杂，控制参数经常多达几十个，实现起来较为困难。  ( T  )
10.	作为一个社交机器人，它也应该满足社会的伦理道德，需要伦理知识。  (  T )
11.	相比语音识别技术，语音合成技术相对更成熟。  ( T  )
12.	espeak命令中，如果设置参数为-s150，则含义为设置每分钟读150个字符。  ( F  )
13.	eSpeak软件是一款用计算机语言编写的开源计算机视频软件。  (  F )
14.	espeak不能控制男性还是女性进行发音。  (F   )
15.	espeak的—stdout是指将文本信息转换成音信息到标准输出，而不是说出来。  ( T  )
16.	cv2模块circle函数的color参数意思为绘制圆内部的颜色。  ( F  ) 
17.	OpenCV 是一个基于BSD许可（开源）的跨平台计算机语音和机器学习软件库。（ F  ）
18.	机器人识别颜色的原理依据是：每个点的像素值（彩色为三通道的RGB）呈现出来的颜色的判决条件是，该点的像素值是否在此颜色的像素值（彩色为三通道的RGB）范围内。（  T ）
19.	R、G、B代表可见光谱中的红、绿、蓝三种基本颜色。 （  T ）
20.	HSV色彩空间的模型对应于圆柱坐标系中的一个圆锥形子集，绕中心轴的角度对应于“色相”，红色对应于角度0°（360°），绿色对应于角度120°，蓝色对应于角度240°。（  T ）
21.	在HSV色彩空间中，每一种颜色和它的补色相差120°。（  F ）  
22.	OpenCV中色彩空间之间的转换可以使用cv2.cvtColor()函数来实现。（ T  ）  
23.	cv2.VideoCapture(0)的意思是以0号摄像头为视频捕获设备创建视频捕获器对象。（  T ） 
24.	OpenCV中一般对颜色空间的图像进行有效处理都是在BGR颜色空间进行。（  F ） 
25.	为了在程序中跟踪某一种颜色，一般需要把图像转换到HSV色彩空间。（ T  ） 
26.	颜色空间按照基本机构可以分为两大类：基色颜色空间和色、亮分离颜色空间（  T ） 
27.	Gray图像指的是彩色图像。（ F  ） 
28.	就色彩空间的原理而言，计算机色彩显示器和彩色电视机显示色彩的原理一样。（ T  ） 
29.	Python中，面向对象编程最重要的概念就是类（Class）和实例（Instance）（  T ）
30.	SDK（Software Development Kit）是指硬件开发工具包。（ F  ） 
31.	API（Application Programming Interface），即应用程序接口，是预先定义的接口，开发人员可以直接调用这些接口来应用功能。（  T ） 

32.	Python中的，类（Class）是指创建出来的一个个具体的“对象”。（ F  ）  
33.	waitKey(10)函数表示等待用户按键交互，这里等待时间是10毫秒。（ T  ） 
34.	waitKey(10)函数表示等待用户按键交互，这里等待时间是10秒。（ F  ） 
35.	imshow()之后必须调用waitkey()，给imshow()提供时间来展示图像，否则只能显示空窗口。（ T  ） 
36.	imshow()之后无须调用waitkey()也能正常显示窗口中的图。（ F  ） 
37.	彩色图像数据的形状是三维的，这三个维度分别是宽、高和通道数。（ F  ） 
38.	灰度图像数据的形状是三维的，这三个维度分别是R、G、B。（  F ） 
39.	MNIST是我国国家标准与技术研究院收集整理的大型手写数字数据库。（ T  ） 
40.	在MNIST数据集中，手写数字一共10种：即0、1、2、3、4、5、6、7、8和9。（ T  ） 
41.	MNIST数据集中原始图片均为三通道彩色图片。（ F  ） 
42.	连杆坐标系是建立在连杆上，与连杆固定连接的坐标系。（ T  ）
43.	机器人的运动控制系统是提高机器人性能的关键因素，主要包含位置控制、速度控制、加速度控制、转矩或力矩控制等。（ T  ）
44.	服务机器人中，通过电机系统和液压系统两种都可以实现机器人的运动控制。（ T  ）
45.	机器人多模态是指机器人可以实现多种形态变化，与机器人感官无关。（ F  ）
46.	中国电子学会结合中国机器人产业发展特性，将机器人分为工业机器人、服务机器人两大类。（ F  ）
47.	机器人颜色跟踪用到的图像预处理技术用到的cv2.inRange函数的目的，是通过设置阈值，从而过滤掉背景部分的图象。  ( T  )
48.	图像预处理中的腐蚀操作的原理，是一个可变尺寸的kernel在图像中不断平移，在该kernel方框中，哪一种颜色所占比重大，kernel中所有方格中都将是这种颜色。  ( T  )
49.	机器人颜色跟踪项目，需要使用多线程协同技术。  ( T  )
50.	机器人追踪目标物体，需首先调用forward_step函数，控制机器人接近目标物体。  ( F )
51.	机器人追踪目标物体，主要是靠机器人追踪函数walk_track的调用。该函数在项目启动到最终追踪到目标物体，总共调用1次函数即可。  ( F  )
52.	机器人追踪目标物体需要根据实时拍摄的图片，首先判断目标物体是否在机器人的正前方。  ( T  )
53.	机器人追踪到目标物体后，需要通过设置一个动作，来判断机器人是否已经完成了追踪动作。  ( T  )
54.	机器人追踪目标物体时需要进行机器人获取的初始图像的预处理。  ( T  )
55.	机器人追踪目标物体，当已经判断目标物体处于视线的正前方，即可执行抱球动作。  (  F )
56.	KartoSLAM算法中运动更新主要是利用里程计数据和激光数据对机器人位姿进行更新。 （ T  ） 
57.	蒙特卡罗定位方法能实现机器人全局定位，也能从机器人全局定位失效中迅速恢复。（ F  ）  
58.	最佳优先搜索（BFS）算法基于贪心策略，得到的搜索结果就是指定节点对之间的最短代价路径。（ F  ）                                                  
59.	A*搜索算法是一种启发式搜索算法，利用启发式信息来引导搜索范围、降低问题复杂度，搜索出指定节点对之间的最短代价路径。（ T  ）                            

60.	A*算法中，close list包含待检测的节点，记录路径中可能会经过的，或可能不经过的节点。（ F  ）                                                          
61.	Dijkstra算法是一种经典的深度优先的状态空间搜索算法。（ F  ）             
62.	TEB算法的核心思想，是通过加权多目标优化模型，考虑各种约束的目标函数，来调整与优化机器人位姿和时间间隔，即获取最优路径点（ T  ）。                   
63.	全局路径规划（global path planning）是在已知的环境中，给机器人规划一条路径，路径规划的精度取决于环境获取的准确度。（  T ）                                                          
64.	最佳优先搜索（BFS）算法基于贪心策略，即搜索最优路径时会搜索全局最优的节点来选择。（ F  ）                                                               
65.	移动机器人SLAM建图可基于激光雷达，采用2D或3D激光雷达都可以。（  T ）
66.	根据激光雷达的不同，可进一步分为2D或3D激光SLAM；另一类是基于视觉的VSLAM（Visual SLAM）。比较这两种SLAM技术，激光SLAM比视觉SLAM起步早，激光雷达测距准确，在理论、技术和产品落地上都更成熟，落地产品更加丰富。（ T  ）          
67.	所谓的图优化，就是把一个常规的优化问题，以图（Graph）的形式来表述。基于图优化的SLAM问题的目标，就是构建图并且找到一个最优的配置，即各节点的位姿，使得预测与观测的误差最小。（ T  ）                                            
68.	KartoSLAM算法是基于图优化的思想，这种方法是以图的方式表示地图。（  T ）
69.	对于服务机器人而言，机器人手臂能够够到的最大工作范围，就是它的，工作空间。（T   ）
70.	当代机器人大军中最主要的机器人为服务机器人。（ F  ）
71.	机器人工作时，工作范围可以站人，不会有任何伤害人的隐患。（  F ）
72.	机器人不用定期保养。 （ F  ）
73.	机器人可以做搬运，焊接，打磨等项目。  （ T  ）
74.	机器人可以有六轴以上。  （ T  ）
75.	机器人程序模块只能有一个。  （ F  ）
76.	从广义上说机器人只包括服务机器人和工业机器人。（ F  ）改
77.	服务机器人应用范围涵盖了维护保养、运输、保洁、安防等工作。（ T  ）
78.	机器人腕部的单自由度有偏转、俯仰和翻转。（ T  ）
79.	机器人的执行机构，常称为机器人关节，关节个数通常为机器人的自由度数（ T  ）
80.	服务机器人跟工业机器人不一样，它（服务机器人）在最开始使用时不需要进行坐标校准。（  F ）
81.	服务机器人的控制系统一般包括主机、转接板、配套电源等部分。（T   ）
82.	机器人对传感器没有特定要求，只要能用就不影响它的感知稳定性。（ F  ）
83.	机器人二自由度腕部关节有RR、BB、RB三种表示方法。（ F  ）
84.	机器人的感知功能通常需要通过各类传感器来实现。（T   ）
85.	和人长的很像的机器才能称为机器人。（F   ）
86.	机械手亦可称之为机器人。（  T ）
87.	完成某一特定作业时具有多余自由度的机器人称为冗余自由度机器人。（ T  ）
88.	关节空间是由全部关节参数构成的。（  T ）
89.	任何复杂的运动都可以分解为由多个平移和绕轴转动的简单运动的合成。（  T ）
90.	艾伦·麦席森·图灵被称为“机器人学之父”。 （ F  ）
91.	机器人的执行机构，常称为机器人关节，但关节个数和自由度数无关（ F  ）
92.	因为机器人是人类发明创造，所以它无论如何都不会伤害到人。（ F  ）
93.	机器人只能做直线运动，不能做有弧度的运动。（  F ）
94.	完成某一特定作业时具有多余自由度的机器人称为冗余自由度机器人。（ T  ）
95.	承载能力是指机器人在工作围的任何位姿上所能承受的最大质量。（ T  ）
96.	工业机器人最早出现在日本。（ F  ）
97.	美国在军用机器人的研究、应用等方面处于绝对的领先地位。（  T ）
98.	机器人的分辨率和精度之间不一定相关联。（  F ）
99.	机器人的自由度数大于关节数目。（ F  ）
100.	机器人三原则是捷克作家卡雷尔·卡佩克提出的。（ F  ）


参考答案：
1-5:√√×√√  6-10:×√×√√  11-15:√×××√  16-20：××√√√
21-25：×√√×√ 26-30：√×√√× 31-35：√×√×√ 36-40：×××√√
41-45：×√√√× 46-50：×√√√× 51-55：×√√√× 56-60：√××√×
61-65：×√√×√ 66-70：√√√√× 71-75：××√√× 76-80：×√√√×
81-85：√××√× 86-90：√√√√× 91-95：×××√√ 96-100：×√×××


 


