//-------------------修改選單命令一行的最大數量--------------------

Window_MenuCommand.prototype.maxCols = function () {
  return 7;
};

// ------------------新增背景圖片MenuBase.png----------------------

Scene_MenuBase.prototype.createBackground = function () {
  this._backgroundSprite = new Sprite();
  // 新增背景圖片MenuBase.png
  this._backgroundSprite.bitmap = ImageManager.loadPicture("MenuBase");
  this.addChild(this._backgroundSprite);
};

//----------- ---------選單項目位置微調 --------------------------------------

// Scene_Menu.prototype.createCommandWindow = function () {
//   this._commandWindow = new Window_MenuCommand(0, 0);
//   this._commandWindow.y = 25; // 設置X位置
//   this._commandWindow.height = 80; // 設置命令選單框高度
//   this._commandWindow.setHandler("item", this.commandItem.bind(this));
//   this._commandWindow.setHandler("skill", this.commandPersonal.bind(this));
//   this._commandWindow.setHandler("equip", this.commandPersonal.bind(this));
//   this._commandWindow.setHandler("status", this.commandPersonal.bind(this));
//   this._commandWindow.setHandler("formation", this.commandFormation.bind(this));
//   this._commandWindow.setHandler("options", this.commandOptions.bind(this));
//   this._commandWindow.setHandler("save", this.commandSave.bind(this));
//   this._commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
//   this._commandWindow.setHandler("cancel", this.popScene.bind(this));
//   this.addWindow(this._commandWindow);
// }; 下面修改

Scene_Menu.prototype.createCommandWindow = function () {
  this._commandWindow = new Window_MenuCommand(0, 0);

  this._commandWindow.y = 25; // 設置X位置
  this._commandWindow.height = 80; // 設置命令選單框高度
  this.createCommandWindowBinds();
  this._commandWindow.setHandler("cancel", this.popScene.bind(this));
  this.addWindow(this._commandWindow);
};

// ----------------- 修改字體 ----------------------------------

Window_Base.prototype.standardFontFace = function () {
  if ($gameSystem.isChinese()) {
    return "GameFont";
  } else if ($gameSystem.isKorean()) {
    return "GameFont";
  } else {
    return "GameFont";
  }
};

//-------------------修改顏色---------------------------

Window_Command.prototype.resetTextColor = function () {
  this.changeTextColor(this.textColor(15));
};

Window_Command.prototype.standardFontSize = function () {
  return 20;
};

/** 更改文字陰影透明度
 * The color of the outline of the text in CSS format.
 *
 * @property outlineColor
 * @type String
 */
this.outlineColor = "rgba(0, 0, 0, 0.1)";

//--------------------取消呼吸光標效果

Window.prototype._updateCursor = function () {
  var blinkCount = this._animationCount % 40;
  var cursorOpacity = this.contentsOpacity;
  // if (this.active) {
  //     if (blinkCount < 20) {
  //         cursorOpacity -= blinkCount * 8;
  //     } else {
  //         cursorOpacity -= (40 - blinkCount) * 8;
  //     }
  // }
  this._windowCursorSprite.alpha = cursorOpacity / 255;
  this._windowCursorSprite.visible = this.isOpen();
};

//-------------------------------新增主角資訊在主頁面---------------------------------------

///@STEP1 回去rpg_scenes.js
// Scene_Menu.prototype.create = function() {
//     Scene_MenuBase.prototype.create.call(this);
//     this.createCommandWindow();
//     this.createGoldWindow();
//       //主角狀態視窗
//   this.createPlayerStatusWindow();
//     this.createStatusWindow();
// };

// 在 Scene_Menu 中創建狀態視窗的方法
Scene_Menu.prototype.createPlayerStatusWindow = function () {
  var x = 590; // 設定為所需的 x 座標
  var y = this._commandWindow.height + 28; // 設定為所需的 y 座標
  this._playerStatusWindow = new Window_PlayerMenuStatus(x, y);
  this.addWindow(this._playerStatusWindow);
};

// 主角狀態視窗
function Window_PlayerMenuStatus() {
  this.initialize.apply(this, arguments);
}

Window_PlayerMenuStatus.prototype = Object.create(Window_Base.prototype);
Window_PlayerMenuStatus.prototype.constructor = Window_PlayerMenuStatus;

Window_PlayerMenuStatus.prototype.initialize = function (x, y) {
  var width = this.windowWidth() / 4;
  var height = this.windowHeight();
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this.refresh();
};

Window_PlayerMenuStatus.prototype.windowWidth = function () {
  return Graphics.boxWidth;
};

Window_PlayerMenuStatus.prototype.windowHeight = function () {
  var h1 = this.fittingHeight(1);
  var h2 = this.fittingHeight(2);
  return Graphics.boxHeight - h1 - h2;
};

Window_PlayerMenuStatus.prototype.refresh = function () {
  this.contents.clear();
  var members = $gameParty.members();
  var actor = members[0];
  this.drawActorFace(actor, 0, this.lineHeight() * 0);
  this.drawActorSimpleStatus(actor, 0, this.lineHeight() * 4);
};

Window_PlayerMenuStatus.prototype.drawActorSimpleStatus = function (
  actor,
  x,
  y
) {
  var width = this.windowWidth() / 5;
  var bottom = y + this.windowHeight() / 2;
  var lineHeight = this.lineHeight();
  this.drawActorName(actor, x, y + lineHeight * 0 + 38, width);
  this.drawActorHp(actor, x, bottom - lineHeight * 3, width);
  this.drawActorMp(actor, x, bottom - lineHeight * 2, width);
  this.drawActorIcons(actor, x, bottom - lineHeight * 1, width);
};

///--------------------// 設置窗口背景透明-------------------------------------------------

Window_Base.prototype.initialize = function (x, y, width, height) {
  Window.prototype.initialize.call(this);
  this.loadWindowskin();
  this.move(x, y, width, height);
  this.updatePadding();
  this.updateBackOpacity();
  this.updateTone();
  this.createContents();
  this._opening = false;
  this._closing = false;
  this._dimmerSprite = null;
  this.opacity = 0; // 設置窗口背景透明
};

///--------------------/----------------------------------------------------------------
///--------------------// 設定選項介面-------------------------------------------------
///--------------------/----------------------------------------------------------------

Window_Options.prototype.initialize = function () {
  Window_Command.prototype.initialize.call(this, 0, 0);
  // 新增背景圖片MenuBase.png
  this._backgroundSprite = new Sprite(); // 创建背景精灵
  this._backgroundSprite.bitmap = ImageManager.loadPicture("MenuSetting"); // 加载背景图片
  this._backgroundSprite.y = -150; // 设置背景 Y 坐标偏移
  this._backgroundSprite.x = -200; // 设置背景 X 坐标偏移
  this.addChildToBack(this._backgroundSprite); // 将背景精灵添加到窗口最底层

  this.updatePlacement();
};

///--------------------/----------------------------------------------------------------
///--------------------// 持有物選項介面-------------------------------------------------
///--------------------/----------------------------------------------------------------

//刪除除了[道具]以外的項目

Window_ItemCategory.prototype.makeCommandList = function () {
  this.addCommand(TextManager.item, "item");
  // this.addCommand(TextManager.weapon,  'weapon');
  // this.addCommand(TextManager.armor,   'armor');
  // this.addCommand(TextManager.keyItem, 'keyItem');
};

Scene_Item.prototype.createHelpWindow = function () {
  this._helpWindow = new Window_Help();
  this._helpWindow.x = 583; // 調整 X 座標
  this._helpWindow.y = 360; // 調整 Y 座標，使其位於底部350
  this._helpWindow.width = 230; // 设置宽度
  this._helpWindow.height = 150; // 设置高度
  this.addWindow(this._helpWindow);
};
