# Rogue Fable III

一款基于 Phaser.js 的经典 Roguelike 地下城探索游戏。

## 项目简介

Rogue Fable III 是一款回合制 Roguelike 游戏，玩家将探索深不见底的地下城，面对各种怪物和挑战，收集装备，提升能力，最终达成目标。游戏具有丰富的角色系统、多样的地图生成机制和深度的物品系统。

## 技术栈

- **游戏引擎**: Phaser.js
- **编程语言**: JavaScript (ES6)
- **渲染**: HTML5 Canvas
- **存储**: LocalStorage (本地存档)
- **音频**: OGG 格式音效

## 游戏特色

### 角色系统

#### 职业选择
游戏提供多种职业，每种职业都有独特的起始装备和天赋树：

- **Warrior (战士)**: 使用盾牌和剑，擅长防御和近战
- **Barbarian (野蛮人)**: 高伤害输出，血量丰厚
- **Rogue (盗贼)**: 敏捷型职业，擅长潜行和暴击
- **Ranger (游侠)**: 远程攻击专家，使用弓箭
- **Wizard (法师)**: 强大的魔法攻击，多种元素法术
- **Cleric (牧师)**: 治疗和辅助能力
- **Necromancer (死灵法师)**: 召唤亡灵大军
- **Enchanter (附魔师)**: 强化装备和物品

#### 种族选择
不同种族提供不同的属性加成：

- **Human (人类)**: 平衡型，无特殊加成
- **Ogre (食人魔)**: 力量+3，智力-3，体型更大
- **Elf (精灵)**: 敏捷型，适合远程职业
- **Dwarf (矮人)**: 耐力型，适合近战职业
- 等更多种族...

### 地图系统

游戏包含多个独特的区域，每个区域都有独特的环境、敌人和生成算法：

#### 主要区域
- **TheUpperDungeon (上层地牢)**: 初级区域，适合新手
- **TheSewers (下水道)**: 潮湿阴暗，充满陷阱
- **TheOrcFortress (奥克要塞)**: 充满奥克战士的堡垒
- **TheIceCaves (冰洞)**: 寒冷的环境，冰系怪物
- **TheUnderGrove (地下丛林)**: 充满植物和自然元素
- **TheSunlessDesert (无光沙漠)**: 炎热的沙漠环境
- **TheSwamp (沼泽)**: 有毒的沼泽地带
- **TheCrypt (地下墓穴)**: 亡灵出没的恐怖之地
- **TheDarkTemple (黑暗神庙)**: 邪教徒的聚集地
- **TheIronFortress (钢铁要塞)**: 高难度区域
- **TheArcaneTower (魔法塔)**: 魔法生物和机关
- **TheCore (核心)**: 最终挑战区域
- **VaultOfYendor (尤多宝库)**: 终极目标

#### 地图生成算法
游戏使用多种程序化生成算法创建独特的地图：

- **BSP Generator**: 二叉空间分割算法
- **Rogue Generator**: 经典 Roguelike 房间连接算法
- **Cycle Generator**: 环形房间生成
- **Cave Generator**: 洞穴地形生成
- **Swamp Generator**: 沼泽地形生成
- **Crypt Generator**: 墓穴风格生成
- **Arcane Generator**: 魔法塔特殊生成
- 等更多生成器...

### 物品系统

#### 武器类型
- **近战武器**: 短剑、长剑、矛、斧头、战锤、匕首等
- **远程武器**: 短弓、长弓、投石索等
- **魔法武器**: 火焰剑、风暴斧、毒匕首、魔法杖等

#### 防具和饰品
- 盾牌、盔甲、头盔、手套、靴子
- 各种饰品提供额外属性加成

#### 消耗品
- 药水：治疗、能量、力量、敏捷等
- 卷轴：识别、传送、火焰、冰冻等
- 食物：回复饥饿度

#### 附魔系统
武器和防具可以通过附魔获得额外属性和特殊效果

### 战斗系统

- **回合制战斗**: 玩家和敌人轮流行动
- **技能系统**: 每个职业都有独特的技能
- **天赋树**: 通过升级解锁和提升天赋
- **状态效果**: 中毒、燃烧、冰冻、麻痹等
- **视野系统**: 战争迷雾和视野范围

## 项目结构

```
RogueFable3-v2/
├── ability/           # 技能和状态效果系统
├── assets/            # 游戏资源
│   ├── audio/        # 音效文件
│   ├── fonts/        # 字体文件
│   ├── images/       # 图像资源
│   └── maps/         # 地图数据
├── character/        # 角色系统
│   ├── player.js     # 玩家角色
│   ├── npc.js        # NPC和敌人
│   ├── player-class.js  # 职业定义
│   └── player-race.js   # 种族定义
├── entity/           # 游戏实体
│   ├── projectile.js # 投射物
│   ├── particle.js   # 粒子效果
│   └── object.js     # 场景物体
├── generator/        # 地图生成器
├── item/             # 物品系统
├── level/            # 关卡系统
├── menu/             # 菜单界面
├── ui/               # 用户界面
├── game.js           # 主游戏逻辑
├── constants.js      # 游戏常量
├── utility.js        # 工具函数
└── index.html        # 入口文件
```

## 如何运行

### 前置要求
- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- 本地 HTTP 服务器

### 启动方法

#### 方法 1: 使用 Python
```bash
python3 -m http.server 8000
```

#### 方法 2: 使用 Node.js
```bash
npx http-server -p 8000
```

#### 方法 3: 使用 PHP
```bash
php -S localhost:8000
```

启动后，在浏览器中访问 `http://localhost:8000` 即可开始游戏。

## 游戏控制

- **方向键 / WASD**: 移动角色
- **鼠标**: 点击按钮和菜单
- **数字键**: 使用快捷技能
- **ESC**: 打开游戏菜单

## 存档系统

游戏使用 LocalStorage 进行本地存档，可以随时保存和继续游戏进度。

## 开发说明

### 代码规范
- 使用 ES6 语法
- 遵循 JSLint 规范
- 模块化设计，功能分离

### 主要模块

1. **gs (Game State)**: 全局游戏状态管理器
2. **levelController**: 关卡控制器
3. **character**: 角色系统
4. **ability**: 技能系统
5. **item**: 物品系统
6. **ui**: 用户界面系统

## 许可证

本项目为开源项目，请参考具体许可证文件。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进游戏！

## 更新日志

- 优化了主菜单按钮样式，增加了阴影和点击效果
- 支持中文界面
- 修复了若干 bug

---

**享受你的冒险之旅！** 🎮⚔️
