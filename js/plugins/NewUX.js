//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// The superclass of all the menu-type scenes.

function Scene_MenuBase() {
  this.initialize.apply(this, arguments);
}

Scene_MenuBase.prototype = Object.create(Scene_Base.prototype);
Scene_MenuBase.prototype.constructor = Scene_MenuBase;

Scene_MenuBase.prototype.initialize = function () {
  Scene_Base.prototype.initialize.call(this);
};

Scene_MenuBase.prototype.create = function () {
  Scene_Base.prototype.create.call(this);
  this.createBackground();
  this.updateActor();
  this.createWindowLayer();
};

Scene_MenuBase.prototype.actor = function () {
  return this._actor;
};

Scene_MenuBase.prototype.updateActor = function () {
  this._actor = $gameParty.menuActor();
};

Scene_MenuBase.prototype.createBackground = function () {
  this._backgroundSprite = new Sprite();
  // 新增背景圖片MenuBase.png
  this._backgroundSprite.bitmap = ImageManager.loadPicture("MenuBase");
  this.addChild(this._backgroundSprite);
};

Scene_MenuBase.prototype.setBackgroundOpacity = function (opacity) {
  this._backgroundSprite.opacity = opacity;
};

Scene_MenuBase.prototype.createHelpWindow = function () {
  this._helpWindow = new Window_Help();
  this.addWindow(this._helpWindow);
};

Scene_MenuBase.prototype.nextActor = function () {
  $gameParty.makeMenuActorNext();
  this.updateActor();
  this.onActorChange();
};

Scene_MenuBase.prototype.previousActor = function () {
  $gameParty.makeMenuActorPrevious();
  this.updateActor();
  this.onActorChange();
};

Scene_MenuBase.prototype.onActorChange = function () {};

//-----------------------------------------------------------------------------
// Scene_Menu
//
// The scene class of the menu screen.

function Scene_Menu() {
  this.initialize.apply(this, arguments);
}

Scene_Menu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Menu.prototype.constructor = Scene_Menu;

Scene_Menu.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Menu.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);
  this.createCommandWindow();
  this.createGoldWindow();
  this.createStatusWindow();
  //創建日誌窗口
  this.createScrollWindow();
};
//創建日誌窗口
Scene_Menu.prototype.createScrollWindow = function () {
  const x = 20;
  const y = this._commandWindow.height - 20;
  const width = 538;
  const height = Graphics.boxHeight - y - 100;
  this._scrollWindow = new Window_Scroll(x, y, width, height);
  this._scrollWindow.refresh(2000); // Content height
  this.addWindow(this._scrollWindow);
};

Scene_Menu.prototype.start = function () {
  Scene_MenuBase.prototype.start.call(this);
  this._statusWindow.refresh();
};

Scene_Menu.prototype.createCommandWindow = function () {
  this._commandWindow = new Window_MenuCommand(0, 0);
  this._commandWindow.x = 0; // 設置X位置
  this._commandWindow.y = 25; // 設置Y位置

  this._commandWindow.setHandler("skill", this.commandPersonal.bind(this));
  this._commandWindow.setHandler("equip", this.commandPersonal.bind(this));
  this._commandWindow.setHandler("status", this.commandPersonal.bind(this));
  this._commandWindow.setHandler("formation", this.commandFormation.bind(this));
  this._commandWindow.setHandler("item", this.commandItem.bind(this));
  this._commandWindow.setHandler("options", this.commandOptions.bind(this));
  this._commandWindow.setHandler("save", this.commandSave.bind(this));
  this._commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
  this._commandWindow.setHandler("cancel", this.popScene.bind(this));
  this.addWindow(this._commandWindow);
};

Scene_Menu.prototype.createGoldWindow = function () {
  this._goldWindow = new Window_Gold(0, 0);
  this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
  this.addWindow(this._goldWindow);
};

Scene_Menu.prototype.createStatusWindow = function () {
  this._statusWindow = new Window_MenuStatus(this._commandWindow.width, 0);
  this._statusWindow.reserveFaceImages();
  this.addWindow(this._statusWindow);
};

Scene_Menu.prototype.commandItem = function () {
  SceneManager.push(Scene_Item);
};

Scene_Menu.prototype.commandPersonal = function () {
  this._statusWindow.setFormationMode(false);
  this._statusWindow.selectLast();
  this._statusWindow.activate();
  this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
  this._statusWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
};

Scene_Menu.prototype.commandFormation = function () {
  this._statusWindow.setFormationMode(true);
  this._statusWindow.selectLast();
  this._statusWindow.activate();
  this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
  this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
};

Scene_Menu.prototype.commandOptions = function () {
  SceneManager.push(Scene_Options);
};

Scene_Menu.prototype.commandSave = function () {
  SceneManager.push(Scene_Save);
};

Scene_Menu.prototype.commandGameEnd = function () {
  SceneManager.push(Scene_GameEnd);
};

Scene_Menu.prototype.onPersonalOk = function () {
  switch (this._commandWindow.currentSymbol()) {
    case "skill":
      SceneManager.push(Scene_Skill);
      break;
    case "equip":
      SceneManager.push(Scene_Equip);
      break;
    case "status":
      SceneManager.push(Scene_Status);
      break;
  }
};

Scene_Menu.prototype.onPersonalCancel = function () {
  this._statusWindow.deselect();
  this._commandWindow.activate();
};

Scene_Menu.prototype.onFormationOk = function () {
  var index = this._statusWindow.index();
  var actor = $gameParty.members()[index];
  var pendingIndex = this._statusWindow.pendingIndex();
  if (pendingIndex >= 0) {
    $gameParty.swapOrder(index, pendingIndex);
    this._statusWindow.setPendingIndex(-1);
    this._statusWindow.redrawItem(index);
  } else {
    this._statusWindow.setPendingIndex(index);
  }
  this._statusWindow.activate();
};

Scene_Menu.prototype.onFormationCancel = function () {
  if (this._statusWindow.pendingIndex() >= 0) {
    this._statusWindow.setPendingIndex(-1);
    this._statusWindow.activate();
  } else {
    this._statusWindow.deselect();
    this._commandWindow.activate();
  }
};

//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.

/*
1. 改windowskin 透明度為0


*/

//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.

function Window_Base() {
  this.initialize.apply(this, arguments);
}

Window_Base.prototype = Object.create(Window.prototype);
Window_Base.prototype.constructor = Window_Base;

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

Window_Base._iconWidth = 32;
Window_Base._iconHeight = 32;
Window_Base._faceWidth = 144;
Window_Base._faceHeight = 144;

Window_Base.prototype.lineHeight = function () {
  return 36;
};

Window_Base.prototype.standardFontFace = function () {
  if ($gameSystem.isChinese()) {
    //return 'SimHei, Heiti TC, sans-serif';
    return "GameFont";
  } else if ($gameSystem.isKorean()) {
    //return 'Dotum, AppleGothic, sans-serif';
    return "GameFont";
  } else {
    return "GameFont";
  }
};

Window_Base.prototype.standardFontSize = function () {
  return 28;
};

Window_Base.prototype.standardPadding = function () {
  return 18;
};

Window_Base.prototype.textPadding = function () {
  return 6;
};

Window_Base.prototype.standardBackOpacity = function () {
  return 192;
};

Window_Base.prototype.loadWindowskin = function () {
  this.windowskin = ImageManager.loadSystem("Window");
};

Window_Base.prototype.updatePadding = function () {
  this.padding = this.standardPadding();
};

Window_Base.prototype.updateBackOpacity = function () {
  this.backOpacity = this.standardBackOpacity();
};

Window_Base.prototype.contentsWidth = function () {
  return this.width - this.standardPadding() * 2;
};

Window_Base.prototype.contentsHeight = function () {
  return this.height - this.standardPadding() * 2;
};

Window_Base.prototype.fittingHeight = function (numLines) {
  return numLines * this.lineHeight() + this.standardPadding() * 2;
};

Window_Base.prototype.updateTone = function () {
  var tone = $gameSystem.windowTone();
  this.setTone(tone[0], tone[1], tone[2]);
};

Window_Base.prototype.createContents = function () {
  this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
  this.resetFontSettings();
};

Window_Base.prototype.resetFontSettings = function () {
  this.contents.fontFace = this.standardFontFace();
  this.contents.fontSize = this.standardFontSize();
  this.resetTextColor();
};

Window_Base.prototype.resetTextColor = function () {
  this.changeTextColor(this.normalColor());
};

Window_Base.prototype.update = function () {
  Window.prototype.update.call(this);
  this.updateTone();
  this.updateOpen();
  this.updateClose();
  this.updateBackgroundDimmer();
};

Window_Base.prototype.updateOpen = function () {
  if (this._opening) {
    this.openness += 32;
    if (this.isOpen()) {
      this._opening = false;
    }
  }
};

Window_Base.prototype.updateClose = function () {
  if (this._closing) {
    this.openness -= 32;
    if (this.isClosed()) {
      this._closing = false;
    }
  }
};

Window_Base.prototype.open = function () {
  if (!this.isOpen()) {
    this._opening = true;
  }
  this._closing = false;
};

Window_Base.prototype.close = function () {
  if (!this.isClosed()) {
    this._closing = true;
  }
  this._opening = false;
};

Window_Base.prototype.isOpening = function () {
  return this._opening;
};

Window_Base.prototype.isClosing = function () {
  return this._closing;
};

Window_Base.prototype.show = function () {
  this.visible = true;
};

Window_Base.prototype.hide = function () {
  this.visible = false;
};

Window_Base.prototype.activate = function () {
  this.active = true;
};

Window_Base.prototype.deactivate = function () {
  this.active = false;
};

Window_Base.prototype.textColor = function (n) {
  var px = 96 + (n % 8) * 12 + 6;
  var py = 144 + Math.floor(n / 8) * 12 + 6;
  return this.windowskin.getPixel(px, py);
};

Window_Base.prototype.normalColor = function () {
  return this.textColor(0);
};

Window_Base.prototype.systemColor = function () {
  return this.textColor(16);
};

Window_Base.prototype.crisisColor = function () {
  return this.textColor(17);
};

Window_Base.prototype.deathColor = function () {
  return this.textColor(18);
};

Window_Base.prototype.gaugeBackColor = function () {
  return this.textColor(19);
};

Window_Base.prototype.hpGaugeColor1 = function () {
  return this.textColor(20);
};

Window_Base.prototype.hpGaugeColor2 = function () {
  return this.textColor(21);
};

Window_Base.prototype.mpGaugeColor1 = function () {
  return this.textColor(22);
};

Window_Base.prototype.mpGaugeColor2 = function () {
  return this.textColor(23);
};

Window_Base.prototype.mpCostColor = function () {
  return this.textColor(23);
};

Window_Base.prototype.powerUpColor = function () {
  return this.textColor(24);
};

Window_Base.prototype.powerDownColor = function () {
  return this.textColor(25);
};

Window_Base.prototype.tpGaugeColor1 = function () {
  return this.textColor(28);
};

Window_Base.prototype.tpGaugeColor2 = function () {
  return this.textColor(29);
};

Window_Base.prototype.tpCostColor = function () {
  return this.textColor(29);
};

Window_Base.prototype.pendingColor = function () {
  return this.windowskin.getPixel(120, 120);
};

Window_Base.prototype.translucentOpacity = function () {
  return 160;
};

Window_Base.prototype.changeTextColor = function (color) {
  this.contents.textColor = color;
};

Window_Base.prototype.changePaintOpacity = function (enabled) {
  this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
};

Window_Base.prototype.drawText = function (text, x, y, maxWidth, align) {
  this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};

Window_Base.prototype.textWidth = function (text) {
  return this.contents.measureTextWidth(text);
};

Window_Base.prototype.drawTextEx = function (text, x, y) {
  if (text) {
    var textState = { index: 0, x: x, y: y, left: x };
    textState.text = this.convertEscapeCharacters(text);
    textState.height = this.calcTextHeight(textState, false);
    this.resetFontSettings();
    while (textState.index < textState.text.length) {
      this.processCharacter(textState);
    }
    return textState.x - x;
  } else {
    return 0;
  }
};

Window_Base.prototype.convertEscapeCharacters = function (text) {
  text = text.replace(/\\/g, "\x1b");
  text = text.replace(/\x1b\x1b/g, "\\");
  text = text.replace(
    /\x1bV\[(\d+)\]/gi,
    function () {
      return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this)
  );
  text = text.replace(
    /\x1bV\[(\d+)\]/gi,
    function () {
      return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this)
  );
  text = text.replace(
    /\x1bN\[(\d+)\]/gi,
    function () {
      return this.actorName(parseInt(arguments[1]));
    }.bind(this)
  );
  text = text.replace(
    /\x1bP\[(\d+)\]/gi,
    function () {
      return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this)
  );
  text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
  return text;
};

Window_Base.prototype.actorName = function (n) {
  var actor = n >= 1 ? $gameActors.actor(n) : null;
  return actor ? actor.name() : "";
};

Window_Base.prototype.partyMemberName = function (n) {
  var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
  return actor ? actor.name() : "";
};

Window_Base.prototype.processCharacter = function (textState) {
  switch (textState.text[textState.index]) {
    case "\n":
      this.processNewLine(textState);
      break;
    case "\f":
      this.processNewPage(textState);
      break;
    case "\x1b":
      this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
      break;
    default:
      this.processNormalCharacter(textState);
      break;
  }
};

Window_Base.prototype.processNormalCharacter = function (textState) {
  var c = textState.text[textState.index++];
  var w = this.textWidth(c);
  this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
  textState.x += w;
};

Window_Base.prototype.processNewLine = function (textState) {
  textState.x = textState.left;
  textState.y += textState.height;
  textState.height = this.calcTextHeight(textState, false);
  textState.index++;
};

Window_Base.prototype.processNewPage = function (textState) {
  textState.index++;
};

Window_Base.prototype.obtainEscapeCode = function (textState) {
  textState.index++;
  var regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;
  var arr = regExp.exec(textState.text.slice(textState.index));
  if (arr) {
    textState.index += arr[0].length;
    return arr[0].toUpperCase();
  } else {
    return "";
  }
};

Window_Base.prototype.obtainEscapeParam = function (textState) {
  var arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
  if (arr) {
    textState.index += arr[0].length;
    return parseInt(arr[0].slice(1));
  } else {
    return "";
  }
};

Window_Base.prototype.processEscapeCharacter = function (code, textState) {
  switch (code) {
    case "C":
      this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
      break;
    case "I":
      this.processDrawIcon(this.obtainEscapeParam(textState), textState);
      break;
    case "{":
      this.makeFontBigger();
      break;
    case "}":
      this.makeFontSmaller();
      break;
  }
};

Window_Base.prototype.processDrawIcon = function (iconIndex, textState) {
  this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
  textState.x += Window_Base._iconWidth + 4;
};

Window_Base.prototype.makeFontBigger = function () {
  if (this.contents.fontSize <= 96) {
    this.contents.fontSize += 12;
  }
};

Window_Base.prototype.makeFontSmaller = function () {
  if (this.contents.fontSize >= 24) {
    this.contents.fontSize -= 12;
  }
};

Window_Base.prototype.calcTextHeight = function (textState, all) {
  var lastFontSize = this.contents.fontSize;
  var textHeight = 0;
  var lines = textState.text.slice(textState.index).split("\n");
  var maxLines = all ? lines.length : 1;

  for (var i = 0; i < maxLines; i++) {
    var maxFontSize = this.contents.fontSize;
    var regExp = /\x1b[\{\}]/g;
    for (;;) {
      var array = regExp.exec(lines[i]);
      if (array) {
        if (array[0] === "\x1b{") {
          this.makeFontBigger();
        }
        if (array[0] === "\x1b}") {
          this.makeFontSmaller();
        }
        if (maxFontSize < this.contents.fontSize) {
          maxFontSize = this.contents.fontSize;
        }
      } else {
        break;
      }
    }
    textHeight += maxFontSize + 8;
  }

  this.contents.fontSize = lastFontSize;
  return textHeight;
};

Window_Base.prototype.drawIcon = function (iconIndex, x, y) {
  var bitmap = ImageManager.loadSystem("IconSet");
  var pw = Window_Base._iconWidth;
  var ph = Window_Base._iconHeight;
  var sx = (iconIndex % 16) * pw;
  var sy = Math.floor(iconIndex / 16) * ph;
  this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};

Window_Base.prototype.drawFace = function (
  faceName,
  faceIndex,
  x,
  y,
  width,
  height
) {
  width = width || Window_Base._faceWidth;
  height = height || Window_Base._faceHeight;
  var bitmap = ImageManager.loadFace(faceName);
  var pw = Window_Base._faceWidth;
  var ph = Window_Base._faceHeight;
  var sw = Math.min(width, pw);
  var sh = Math.min(height, ph);
  var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
  var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
  var sx = (faceIndex % 4) * pw + (pw - sw) / 2;
  var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
  this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

Window_Base.prototype.drawCharacter = function (
  characterName,
  characterIndex,
  x,
  y
) {
  var bitmap = ImageManager.loadCharacter(characterName);
  var big = ImageManager.isBigCharacter(characterName);
  var pw = bitmap.width / (big ? 3 : 12);
  var ph = bitmap.height / (big ? 4 : 8);
  var n = characterIndex;
  var sx = ((n % 4) * 3 + 1) * pw;
  var sy = Math.floor(n / 4) * 4 * ph;
  this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
};

Window_Base.prototype.drawGauge = function (x, y, width, rate, color1, color2) {
  var fillW = Math.floor(width * rate);
  var gaugeY = y + this.lineHeight() - 8;
  this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
  this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

Window_Base.prototype.hpColor = function (actor) {
  if (actor.isDead()) {
    return this.deathColor();
  } else if (actor.isDying()) {
    return this.crisisColor();
  } else {
    return this.normalColor();
  }
};

Window_Base.prototype.mpColor = function (actor) {
  return this.normalColor();
};

Window_Base.prototype.tpColor = function (actor) {
  return this.normalColor();
};

Window_Base.prototype.drawActorCharacter = function (actor, x, y) {
  this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
};

Window_Base.prototype.drawActorFace = function (actor, x, y, width, height) {
  this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
};

Window_Base.prototype.drawActorName = function (actor, x, y, width) {
  width = width || 168;
  this.changeTextColor(this.hpColor(actor));
  this.drawText(actor.name(), x, y, width);
};

Window_Base.prototype.drawActorClass = function (actor, x, y, width) {
  width = width || 168;
  this.resetTextColor();
  this.drawText(actor.currentClass().name, x, y, width);
};

Window_Base.prototype.drawActorNickname = function (actor, x, y, width) {
  width = width || 270;
  this.resetTextColor();
  this.drawText(actor.nickname(), x, y, width);
};

Window_Base.prototype.drawActorLevel = function (actor, x, y) {
  this.changeTextColor(this.systemColor());
  this.drawText(TextManager.levelA, x, y, 48);
  this.resetTextColor();
  this.drawText(actor.level, x + 84, y, 36, "right");
};

Window_Base.prototype.drawActorIcons = function (actor, x, y, width) {
  width = width || 144;
  var icons = actor
    .allIcons()
    .slice(0, Math.floor(width / Window_Base._iconWidth));
  for (var i = 0; i < icons.length; i++) {
    this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
  }
};

Window_Base.prototype.drawCurrentAndMax = function (
  current,
  max,
  x,
  y,
  width,
  color1,
  color2
) {
  var labelWidth = this.textWidth("HP");
  var valueWidth = this.textWidth("0000");
  var slashWidth = this.textWidth("/");
  var x1 = x + width - valueWidth;
  var x2 = x1 - slashWidth;
  var x3 = x2 - valueWidth;
  if (x3 >= x + labelWidth) {
    this.changeTextColor(color1);
    this.drawText(current, x3, y, valueWidth, "right");
    this.changeTextColor(color2);
    this.drawText("/", x2, y, slashWidth, "right");
    this.drawText(max, x1, y, valueWidth, "right");
  } else {
    this.changeTextColor(color1);
    this.drawText(current, x1, y, valueWidth, "right");
  }
};

Window_Base.prototype.drawActorHp = function (actor, x, y, width) {
  width = width || 186;
  var color1 = this.hpGaugeColor1();
  var color2 = this.hpGaugeColor2();
  this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
  this.changeTextColor(this.systemColor());
  this.drawText(TextManager.hpA, x, y, 44);
  this.drawCurrentAndMax(
    actor.hp,
    actor.mhp,
    x,
    y,
    width,
    this.hpColor(actor),
    this.normalColor()
  );
};

Window_Base.prototype.drawActorMp = function (actor, x, y, width) {
  width = width || 186;
  var color1 = this.mpGaugeColor1();
  var color2 = this.mpGaugeColor2();
  this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
  this.changeTextColor(this.systemColor());
  this.drawText(TextManager.mpA, x, y, 44);
  this.drawCurrentAndMax(
    actor.mp,
    actor.mmp,
    x,
    y,
    width,
    this.mpColor(actor),
    this.normalColor()
  );
};

Window_Base.prototype.drawActorTp = function (actor, x, y, width) {
  width = width || 96;
  var color1 = this.tpGaugeColor1();
  var color2 = this.tpGaugeColor2();
  this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
  this.changeTextColor(this.systemColor());
  this.drawText(TextManager.tpA, x, y, 44);
  this.changeTextColor(this.tpColor(actor));
  this.drawText(actor.tp, x + width - 64, y, 64, "right");
};

Window_Base.prototype.drawActorSimpleStatus = function (actor, x, y, width) {
  var lineHeight = this.lineHeight();
  var x2 = x + 180;
  var width2 = Math.min(200, width - 180 - this.textPadding());
  this.drawActorName(actor, x, y);
  this.drawActorLevel(actor, x, y + lineHeight * 1);
  this.drawActorIcons(actor, x, y + lineHeight * 2);
  this.drawActorClass(actor, x2, y);
  this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
  this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
};

Window_Base.prototype.drawItemName = function (item, x, y, width) {
  width = width || 312;
  if (item) {
    var iconBoxWidth = Window_Base._iconWidth + 4;
    this.resetTextColor();
    this.drawIcon(item.iconIndex, x + 2, y + 2);
    this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
  }
};

Window_Base.prototype.drawCurrencyValue = function (value, unit, x, y, width) {
  var unitWidth = Math.min(80, this.textWidth(unit));
  this.resetTextColor();
  this.drawText(value, x, y, width - unitWidth - 6, "right");
  this.changeTextColor(this.systemColor());
  this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
};

Window_Base.prototype.paramchangeTextColor = function (change) {
  if (change > 0) {
    return this.powerUpColor();
  } else if (change < 0) {
    return this.powerDownColor();
  } else {
    return this.normalColor();
  }
};

Window_Base.prototype.setBackgroundType = function (type) {
  if (type === 0) {
    this.opacity = 255;
  } else {
    this.opacity = 0;
  }
  if (type === 1) {
    this.showBackgroundDimmer();
  } else {
    this.hideBackgroundDimmer();
  }
};

Window_Base.prototype.showBackgroundDimmer = function () {
  if (!this._dimmerSprite) {
    this._dimmerSprite = new Sprite();
    this._dimmerSprite.bitmap = new Bitmap(0, 0);
    this.addChildToBack(this._dimmerSprite);
  }
  var bitmap = this._dimmerSprite.bitmap;
  if (bitmap.width !== this.width || bitmap.height !== this.height) {
    this.refreshDimmerBitmap();
  }
  this._dimmerSprite.visible = true;
  this.updateBackgroundDimmer();
};

Window_Base.prototype.hideBackgroundDimmer = function () {
  if (this._dimmerSprite) {
    this._dimmerSprite.visible = false;
  }
};

Window_Base.prototype.updateBackgroundDimmer = function () {
  if (this._dimmerSprite) {
    this._dimmerSprite.opacity = this.openness;
  }
};

Window_Base.prototype.refreshDimmerBitmap = function () {
  if (this._dimmerSprite) {
    var bitmap = this._dimmerSprite.bitmap;
    var w = this.width;
    var h = this.height;
    var m = this.padding;
    var c1 = this.dimColor1();
    var c2 = this.dimColor2();
    bitmap.resize(w, h);
    bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
    bitmap.fillRect(0, m, w, h - m * 2, c1);
    bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
    this._dimmerSprite.setFrame(0, 0, w, h);
  }
};

Window_Base.prototype.dimColor1 = function () {
  return "rgba(0, 0, 0, 0.6)";
};

Window_Base.prototype.dimColor2 = function () {
  return "rgba(0, 0, 0, 0)";
};

Window_Base.prototype.canvasToLocalX = function (x) {
  var node = this;
  while (node) {
    x -= node.x;
    node = node.parent;
  }
  return x;
};

Window_Base.prototype.canvasToLocalY = function (y) {
  var node = this;
  while (node) {
    y -= node.y;
    node = node.parent;
  }
  return y;
};

Window_Base.prototype.reserveFaceImages = function () {
  $gameParty.members().forEach(function (actor) {
    ImageManager.reserveFace(actor.faceName());
  }, this);
};

//-----------------------------------------------------------------------------
// Window_Command
//
// The superclass of windows for selecting a command.

function Window_Command() {
  this.initialize.apply(this, arguments);
}

Window_Command.prototype = Object.create(Window_Selectable.prototype);
Window_Command.prototype.constructor = Window_Command;

Window_Command.prototype.initialize = function (x, y) {
  this.clearCommandList();
  this.makeCommandList();
  var width = this.windowWidth();
  var height = this.windowHeight();
  Window_Selectable.prototype.initialize.call(this, x, y, width, height);
  this.refresh();
  this.select(0);
  this.activate();
};

Window_Command.prototype.windowWidth = function () {
  return 240;
};

Window_Command.prototype.windowHeight = function () {
  return this.fittingHeight(this.numVisibleRows());
};

Window_Command.prototype.numVisibleRows = function () {
  return Math.ceil(this.maxItems() / this.maxCols());
};

Window_Command.prototype.maxItems = function () {
  return this._list.length;
};

Window_Command.prototype.clearCommandList = function () {
  this._list = [];
};

Window_Command.prototype.makeCommandList = function () {};

Window_Command.prototype.addCommand = function (name, symbol, enabled, ext) {
  if (enabled === undefined) {
    enabled = true;
  }
  if (ext === undefined) {
    ext = null;
  }
  this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
};

Window_Command.prototype.commandName = function (index) {
  return this._list[index].name;
};

Window_Command.prototype.commandSymbol = function (index) {
  return this._list[index].symbol;
};

Window_Command.prototype.isCommandEnabled = function (index) {
  return this._list[index].enabled;
};

Window_Command.prototype.currentData = function () {
  return this.index() >= 0 ? this._list[this.index()] : null;
};

Window_Command.prototype.isCurrentItemEnabled = function () {
  return this.currentData() ? this.currentData().enabled : false;
};

Window_Command.prototype.currentSymbol = function () {
  return this.currentData() ? this.currentData().symbol : null;
};

Window_Command.prototype.currentExt = function () {
  return this.currentData() ? this.currentData().ext : null;
};

Window_Command.prototype.findSymbol = function (symbol) {
  for (var i = 0; i < this._list.length; i++) {
    if (this._list[i].symbol === symbol) {
      return i;
    }
  }
  return -1;
};

Window_Command.prototype.selectSymbol = function (symbol) {
  var index = this.findSymbol(symbol);
  if (index >= 0) {
    this.select(index);
  } else {
    this.select(0);
  }
};

Window_Command.prototype.findExt = function (ext) {
  for (var i = 0; i < this._list.length; i++) {
    if (this._list[i].ext === ext) {
      return i;
    }
  }
  return -1;
};

Window_Command.prototype.selectExt = function (ext) {
  var index = this.findExt(ext);
  if (index >= 0) {
    this.select(index);
  } else {
    this.select(0);
  }
};

Window_Command.prototype.drawItem = function (index) {
  var rect = this.itemRectForText(index);
  var align = this.itemTextAlign();
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
  this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_Command.prototype.itemTextAlign = function () {
  return "left";
};

Window_Command.prototype.isOkEnabled = function () {
  return true;
};

Window_Command.prototype.callOkHandler = function () {
  var symbol = this.currentSymbol();
  if (this.isHandled(symbol)) {
    this.callHandler(symbol);
  } else if (this.isHandled("ok")) {
    Window_Selectable.prototype.callOkHandler.call(this);
  } else {
    this.activate();
  }
};

Window_Command.prototype.refresh = function () {
  this.clearCommandList();
  this.makeCommandList();
  this.createContents();
  Window_Selectable.prototype.refresh.call(this);
};

//更改字的顏色大小

Window_Command.prototype.resetTextColor = function () {
  this.changeTextColor(this.textColor(15));
};

Window_Command.prototype.standardFontSize = function () {
  return 20;
};

//-----------------------------------------------------------------------------
// Window_MenuStatus
//
// The window for displaying party member status on the menu screen.

function Window_MenuStatus() {
  this.initialize.apply(this, arguments);
}

Window_MenuStatus.prototype = Object.create(Window_Selectable.prototype);
Window_MenuStatus.prototype.constructor = Window_MenuStatus;

Window_MenuStatus.prototype.initialize = function (x, y) {
  var width = this.windowWidth();
  var height = this.windowHeight();
  Window_Selectable.prototype.initialize.call(this, x, y, width, height);
  this._formationMode = false;
  this._pendingIndex = -1;
  this.refresh();
};

Window_MenuStatus.prototype.windowWidth = function () {
  return Graphics.boxWidth - 240;
};

Window_MenuStatus.prototype.windowHeight = function () {
  return Graphics.boxHeight;
};

Window_MenuStatus.prototype.maxItems = function () {
  return $gameParty.size();
};

Window_MenuStatus.prototype.itemHeight = function () {
  var clientHeight = this.height - this.padding * 2;
  return Math.floor(clientHeight / this.numVisibleRows());
};

Window_MenuStatus.prototype.numVisibleRows = function () {
  return 4;
};

Window_MenuStatus.prototype.loadImages = function () {
  $gameParty.members().forEach(function (actor) {
    ImageManager.reserveFace(actor.faceName());
  }, this);
};

Window_MenuStatus.prototype.drawItem = function (index) {
  this.drawItemBackground(index);

  //只繪製第一個腳色資訊
  this.drawItemImage(0);
  this.drawItemStatus(0);
};

Window_MenuStatus.prototype.drawItemBackground = function (index) {
  if (index === this._pendingIndex) {
    var rect = this.itemRect(index);
    var color = this.pendingColor();
    this.changePaintOpacity(false);
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.changePaintOpacity(true);
  }
};

Window_MenuStatus.prototype.drawItemImage = function (index) {
  var actor = $gameParty.members()[index];
  var rect = this.itemRect(index);
  this.changePaintOpacity(actor.isBattleMember());
  this.drawActorFace(
    actor,
    rect.x + adjustX,
    rect.y + adjustY,
    Window_Base._faceWidth,
    Window_Base._faceHeight
  );
  this.changePaintOpacity(true);
};

Window_MenuStatus.prototype.drawItemStatus = function (index) {
  var actor = $gameParty.members()[index];
  var rect = this.itemRect(index);
  var x = rect.x + 162;
  var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
  var width = rect.width - x - this.textPadding();
  this.drawActorSimpleStatus(actor, x, y, width);
};

Window_MenuStatus.prototype.processOk = function () {
  Window_Selectable.prototype.processOk.call(this);
  $gameParty.setMenuActor($gameParty.members()[this.index()]);
};

Window_MenuStatus.prototype.isCurrentItemEnabled = function () {
  if (this._formationMode) {
    var actor = $gameParty.members()[this.index()];
    return actor && actor.isFormationChangeOk();
  } else {
    return true;
  }
};

Window_MenuStatus.prototype.selectLast = function () {
  this.select($gameParty.menuActor().index() || 0);
};

Window_MenuStatus.prototype.formationMode = function () {
  return this._formationMode;
};

Window_MenuStatus.prototype.setFormationMode = function (formationMode) {
  this._formationMode = formationMode;
};

Window_MenuStatus.prototype.pendingIndex = function () {
  return this._pendingIndex;
};

Window_MenuStatus.prototype.setPendingIndex = function (index) {
  var lastPendingIndex = this._pendingIndex;
  this._pendingIndex = index;
  this.redrawItem(this._pendingIndex);
  this.redrawItem(lastPendingIndex);
};

//-----------------------------------------------------------------------------
// 新增小窗口
//

// 自定义的滚动窗口类 Window_Scroll 继承自 Window_Base
class Window_Scroll extends Window_Base {
  constructor(x, y, width, height) {
    super(x, y, width, height); // 调用父类构造函数初始化窗口
    this.initializeScroll(); // 初始化滚动窗口
  }

  // 初始化滚动窗口
  initializeScroll() {
    this._scrollY = 0; // 初始滚动位置
    this._scrollMaxY = 0; // 滚动的最大 Y 值
    this._scrollSpeed = 5; // 滚动速度
    this._touching = false; // 是否触摸中
    this._touchY = 0; // 触摸的 Y 坐标
    this.createScrollBar(); // 创建滚动条
    this.createBackground(); // 创建背景
    this.resetTextColor();
  }

  resetTextColor() {
    this.changeTextColor(this.textColor(19));
    this.contents.outlineColor = "rgba(0, 0, 0, 0)"; // 設定陰影顏色為透明
  }

  // 创建滚动条
  createScrollBar() {
    this._scrollBar = new Sprite(new Bitmap(22, 152)); // 创建滚动条精灵
    this._scrollBar.bitmap.fillRect(0, 0, 22, 152, "#000000"); // 填充滚动条背景色
    this._scrollBar.opacity = 225; // 设置滚动条不透明度
    // 绘制阴影效果
    const shadowColor0 = "#fff"; // 阴影颜色
    const shadowOffset0X = 0; // 阴影 X 偏移
    const shadowOffset0Y = 0; // 阴影 Y 偏移
    this._scrollBar.bitmap.fillRect(
      shadowOffset0X,
      shadowOffset0Y,
      21,
      2,
      shadowColor0
    );
    // 绘制阴影效果
    const shadowColor1 = "#fff"; // 阴影颜色
    const shadowOffset1X = 0; // 阴影 X 偏移
    const shadowOffset1Y = 0; // 阴影 Y 偏移
    this._scrollBar.bitmap.fillRect(
      shadowOffset1X,
      shadowOffset1Y,
      2,
      152,
      shadowColor1
    );
    const shadowColor = "#afafaf"; // 阴影颜色
    const shadowOffsetX = 2; // 阴影 X 偏移
    const shadowOffsetY = 2; // 阴影 Y 偏移
    this._scrollBar.bitmap.fillRect(
      shadowOffsetX,
      shadowOffsetY,
      18,
      146,
      shadowColor
    );
    this.addChild(this._scrollBar); // 将滚动条精灵添加到窗口中
    this.updateScrollBar(); // 更新滚动条位置
  }

  // 创建背景
  createBackground() {
    this._backgroundSprite = new Sprite(); // 创建背景精灵
    this._backgroundSprite.bitmap = ImageManager.loadPicture("MenuGameLog"); // 加载背景图片
    this._backgroundSprite.y = -87; // 设置背景 Y 坐标偏移
    this._backgroundSprite.x = -20; // 设置背景 X 坐标偏移
    this.addChildToBack(this._backgroundSprite); // 将背景精灵添加到窗口最底层
  }

  // 更新窗口内容
  update() {
    super.update(); // 调用父类的更新方法
    this.updateScroll(); // 更新滚动
    this.updateScrollBar(); // 更新滚动条
    this.processTouch(); // 处理触摸事件
    this.processMouseWheel(); // 处理鼠标滚轮事件
    this.refresh(2000);
  }

  // 处理鼠标滚轮事件
  processMouseWheel() {
    const threshold = 0.05; // 滚轮滚动的阈值，可以根据需要调整
    const deltaY = TouchInput.wheelY; // 获取鼠标滚轮的滚动距离
    this._scrollSpeed = 40;
    if (Math.abs(deltaY) >= threshold) {
      // 根据滚轮滚动方向调整滚动位置
      this._scrollY += deltaY > 0 ? this._scrollSpeed : -this._scrollSpeed;
    }
  }

  // 更新滚动位置
  updateScroll() {
    if (this._scrollY < 0) this._scrollY = 0; // 确保滚动位置不小于 0
    if (this._scrollY > this._scrollMaxY) this._scrollY = this._scrollMaxY; // 确保滚动位置不超过最大值
    this.origin.y = this._scrollY; // 设置窗口内容的起始 Y 坐标
  }

  // 更新滚动条
  updateScrollBar() {
    const barHeight = 150;
    const barY =
      (this._scrollY / this._scrollMaxY) * (this.height - barHeight) + 35; // 计算滚动条的 Y 坐标
    this._scrollBar.move(this.width - 20, barY); // 设置滚动条的位置
    this._scrollBar.height = barHeight; // 设置滚动条的高度
  }

  // 处理触摸事件
  processTouch() {
    if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
      this._touching = true; // 标记触摸开始
      this._touchY = TouchInput.y; // 记录触摸的 Y 坐标
    }
    if (this._touching) {
      if (TouchInput.isPressed()) {
        const deltaY = this._touchY - TouchInput.y; // 计算触摸滑动的距离
        this._scrollY += deltaY; // 更新滚动位置
        this._touchY = TouchInput.y; // 更新触摸的 Y 坐标
      } else {
        this._touching = false; // 标记触摸结束
      }
    }
  }

  // 检查触摸点是否在窗口内部
  isTouchedInsideFrame() {
    const x = this.canvasToLocalX(TouchInput.x); // 获取触摸点的局部 X 坐标
    const y = this.canvasToLocalY(TouchInput.y); // 获取触摸点的局部 Y 坐标
    return x >= 0 && y >= 0 && x < this.width && y < this.height; // 判断触摸点是否在窗口范围内
  }

  // 设置滚动内容的总高度
  setScrollContentHeight(contentHeight) {
    this._scrollMaxY = contentHeight - this.height; // 计算滚动的最大 Y 值
    if (this._scrollMaxY < 0) this._scrollMaxY = 0; // 确保最大 Y 值不小于 0
  }

  // 刷新窗口内容
  refresh(contentHeight) {
    this.setScrollContentHeight(contentHeight); // 设置滚动内容的总高度
    this.createContents(); // 创建窗口内容

    let totalHeight = 0; // 初始化总高度
    const lineHeight = this.lineHeight(); // 获取行高

    // 绘制内容
    for (let i = 0; i < 100; i++) {
      this.drawText(
        "texttexttexttexttexttexttext",
        0,
        i * lineHeight,
        this.contentsWidth()
      ); // 绘制文本
      const text = `Item ${i + 1}`; // 文本内容
      this.drawText(text, 0, i * lineHeight, this.contentsWidth()); // 绘制文本
      totalHeight += lineHeight; // 累加行高
    }

    // 绘制额外的长文本以确保滚动
    const longText = "Your long text goes here..."; // 长文本内容
    const longTextLines = longText.split("\n").length; // 计算长文本行数
    const longTextHeight = longTextLines * lineHeight; // 计算长文本高度
    this.drawText(longText, 0, totalHeight, this.contentsWidth()); // 绘制长文本

    // 更新总内容高度
    totalHeight += longTextHeight;

    // 设置滚动内容的总高度
    this.setScrollContentHeight(totalHeight);
  }
}
