//=============================================================================
// AltMenuScreen.js
//=============================================================================

/*:
 * @plugindesc Alternative menu screen layout.
 * @author Yoji Ojima
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc メニュー画面のレイアウトを変更します。
 * @author Yoji Ojima
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function () {
  var _Scene_Menu_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function () {
    _Scene_Menu_create.call(this);
    this._statusWindow.x = 0;
    this._statusWindow.y = this._commandWindow.height;
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
  };

  Window_MenuCommand.prototype.windowWidth = function () {
    return Graphics.boxWidth;
  };

  Window_MenuCommand.prototype.maxCols = function () {
    return 5;
  };

  Window_MenuCommand.prototype.numVisibleRows = function () {
    return 2;
  };

  Window_MenuStatus.prototype.windowWidth = function () {
    return Graphics.boxWidth;
  };

  Window_MenuStatus.prototype.windowHeight = function () {
    var h1 = this.fittingHeight(1);
    var h2 = this.fittingHeight(2);
    return Graphics.boxHeight - h1 - h2;
  };

  Window_MenuStatus.prototype.maxCols = function () {
    return 4;
  };

  Window_MenuStatus.prototype.numVisibleRows = function () {
    return 1;
  };

  Window_MenuStatus.prototype.drawItemImage = function (index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRectForText(index);
    var w = Math.min(rect.width, 144);
    var h = Math.min(rect.height, 144);
    // 調整頭像位置
    var adjustX = 590;
    var adjustY = 90;
    var lineHeight = this.lineHeight();
    this.changePaintOpacity(actor.isBattleMember());
    this.drawActorFace(
      actor,
      rect.x + adjustX,
      rect.y + lineHeight * 2.5 - adjustY,
      w,
      h
    );
    this.changePaintOpacity(true);
  };

  Window_MenuStatus.prototype.drawItemStatus = function (index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRectForText(index);
    var x = rect.x;
    var y = rect.y;
    // 調整位置
    var adjustX = 560;
    var adjustY = 90;
    var width = rect.width;
    var bottom = y + rect.height;
    var lineHeight = this.lineHeight();
    this.drawActorName(
      actor,
      x + adjustX + 55,
      y + lineHeight * 0 + 182,
      width
    );
    //this.drawActorLevel(actor, x, y + lineHeight * 1, width);
    this.drawActorClass(actor, x + adjustX, bottom - lineHeight * 4, width);
    this.drawActorHp(actor, x + adjustX, bottom - lineHeight * 3, width);
    this.drawActorMp(actor, x + adjustX, bottom - lineHeight * 2, width);
    this.drawActorIcons(actor, x + adjustX, bottom - lineHeight * 1, width);
  };

  Window_Base.prototype.standardFontSize = function () {
    return 18;
  };

  //更改字的顏色大小
  Window_MenuStatus.prototype.resetTextColor = function () {
    this.changeTextColor(this.textColor(19));
    this.contents.outlineColor = "rgba(0, 0, 0, 0)"; // 設定陰影顏色為透明
  };

  Window_MenuStatus.prototype.drawActorName = function (actor, x, y, width) {
    width = width || 168;
    this.changeTextColor(this.textColor(19));
    this.contents.outlineColor = "rgba(0, 0, 0, 0)"; // 設定陰影顏色為透明
    this.resetTextColor();
    this.drawText(actor.name(), x, y, width);
  };

  Window_MenuStatus.prototype.standardFontSize = function () {
    return 18;
  };

  var _Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
  Window_MenuActor.prototype.initialize = function () {
    _Window_MenuActor_initialize.call(this);
    this.y = this.fittingHeight(2);
  };
})();
