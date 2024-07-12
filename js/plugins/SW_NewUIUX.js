Scene_MenuBase.prototype.createBackground = function () {
  this._backgroundSprite = new Sprite();
  // 新增背景圖片MenuBase.png
  this._backgroundSprite.bitmap = ImageManager.loadPicture("MenuBase");
  this.addChild(this._backgroundSprite);
};

// 修改字體

Window_Base.prototype.standardFontFace = function () {
  if ($gameSystem.isChinese()) {
    return "GameFont";
  } else if ($gameSystem.isKorean()) {
    return "GameFont";
  } else {
    return "GameFont";
  }
};

// // 設置窗口windowskin 背景透明

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
  //this.opacity = 0; // 設置窗口背景透明
};

//選單項目位置微調
Scene_Menu.prototype.createCommandWindow = function () {
  this._commandWindow = new Window_MenuCommand(0, 0);
  this._commandWindow.x = 0; // 設置X位置
  this._commandWindow.y = 25; // 設置Y位置
  this._commandWindow.setHandler("item", this.commandItem.bind(this));
  this._commandWindow.setHandler("skill", this.commandPersonal.bind(this));
  this._commandWindow.setHandler("equip", this.commandPersonal.bind(this));
  this._commandWindow.setHandler("status", this.commandPersonal.bind(this));
  this._commandWindow.setHandler("formation", this.commandFormation.bind(this));
  this._commandWindow.setHandler("options", this.commandOptions.bind(this));
  this._commandWindow.setHandler("save", this.commandSave.bind(this));
  this._commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
  this._commandWindow.setHandler("cancel", this.popScene.bind(this));
  this.addWindow(this._commandWindow);
};

// 刪除呼吸光

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

//更改字的顏色大小

Window_Command.prototype.resetTextColor = function () {
  this.outlineColor = "rgba(0, 0, 0, 0.1)";
  this.changeTextColor(this.textColor(15));
};

Window_Command.prototype.standardFontSize = function () {
  return 20;
};

//---------------------刪除除了[道具]以外的項目

Window_ItemCategory.prototype.makeCommandList = function () {
  this.addCommand(TextManager.item, "item");
  // Remove other categories
  // this.addCommand(TextManager.weapon, 'weapon');
  // this.addCommand(TextManager.armor, 'armor');
  // this.addCommand(TextManager.keyItem, 'keyItem');
};

//
Scene_Item.prototype.createHelpWindow = function () {
  this._helpWindow = new Window_Help();
  this._helpWindow.x = 580; // 調整 X 座標
  this._helpWindow.y = 350; // 調整 Y 座標，使其位於底部350
  this._helpWindow.width = 200; // 设置宽度
  this._helpWindow.height = 100; // 设置高度
  this.addWindow(this._helpWindow);
};

//------------------------------------------NEW status---------------------------------------

// 主角狀態視窗

////------------下寫
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

//-----------------------------------------------------------------修改狀態角色

Window_Base.prototype.standardFontSize = function () {
  return 18;
};

//更改字的顏色大小
Window_PlayerMenuStatus.prototype.resetTextColor = function () {
  this.changeTextColor(this.textColor(19));
  this.contents.outlineColor = "rgba(0, 0, 0, 0)"; // 設定陰影顏色為透明
};

Window_PlayerMenuStatus.prototype.drawActorName = function (
  actor,
  x,
  y,
  width
) {
  width = width || 168;
  this.changeTextColor(this.textColor(19));
  this.contents.outlineColor = "rgba(0, 0, 0, 0)"; // 設定陰影顏色為透明
  this.resetTextColor();
  this.drawText(actor.name(), x, y, width);
};

Window_PlayerMenuStatus.prototype.standardFontSize = function () {
  return 18;
};

Window_Base.prototype.standardFontSize = function () {
  return 18;
};

// ////------------------------------------------------------
// //-----------------------------------------------------------------------------
// // SceneAC_Item
// //
// // The scene class of the SceneAC_Item screen.
// function Scene_StatusAC() {
//   this.initialize.apply(this, arguments);
// }

// Scene_StatusAC.prototype = Object.create(Scene_MenuBase.prototype);
// Scene_StatusAC.prototype.constructor = Scene_StatusAC;

// Scene_StatusAC.prototype.initialize = function () {
//   Scene_MenuBase.prototype.initialize.call(this);
// };

// Scene_StatusAC.prototype.create = function () {
//   Scene_MenuBase.prototype.create.call(this);

//   // 添加黑色測試視窗
//   var testWindow = new Window_Base(0, 0, 90, 90);
//   testWindow.setBackgroundType(1); // 設置背景類型為黑色
//   this.addWindow(testWindow);
//   this.commandPersonal();
//   this.createStatusWindow();
//   this.commandStatusAC();
// };

// Scene_StatusAC.prototype.start = function () {
//   Scene_MenuBase.prototype.start.call(this);
//   this._statusACWindow.refresh();
// };

// Scene_StatusAC.prototype.createStatusWindow = function () {
//   this._statusACWindow = new Window_MenuStatus(0, 0);
//   this._statusACWindow.reserveFaceImages();
//   this.addWindow(this._statusACWindow);
// };

// Scene_StatusAC.prototype.onPersonalOk = function () {
//   switch (this._commandWindow.currentSymbol()) {
//     case "skill":
//       SceneManager.push(Scene_Skill);
//       break;
//     case "equip":
//       SceneManager.push(Scene_Equip);
//       break;
//     case "status":
//       SceneManager.push(Scene_Status);
//       break;
//   }
// };

// // 加入console.log偵錯
// Scene_StatusAC.prototype.commandStatusAC = function () {
//   console.log("Command 'statusAC' is executed.");
//   SceneManager.push(Scene_StatusAC);
//   SceneManager.prepareNextScene(); // 確保下一個場景準備好
//   SceneManager.scene().create(); // 手動呼叫 create 方法
// };

// Scene_StatusAC.prototype.onPersonalCancel = function () {
//   this._statusACWindow.deselect();
//   this._commandWindow.activate();
// };

// Scene_StatusAC.prototype.commandPersonal = function () {
//   this._statusACWindow.setFormationMode(false);
//   this._statusACWindow.selectLast();
//   this._statusACWindow.activate();
//   this._statusACWindow.setHandler("ok", this.onPersonalOk.bind(this));
//   this._statusACWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
// };
