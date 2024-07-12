//=============================================================================
// UI_ScrollWindow.js
//=============================================================================
/*:
 * @plugindesc Scrollable Window
 * @author Hoozuki Araragi
 *
 * @help This plugin does not provide plugin commands.
 */
class Window_Scroll extends Window_Base {
  /**
   *
   * @param {Number} fX
   * @param {Number} fY
   * @param {Number} fWidth
   * @param {Number} fHeight
   */
  constructor(fX, fY, fWidth, fHeight) {
    super(fX, fY, fWidth, fHeight);
    this._bTouching = false;
    this._bTouched = false;
    this._fScrollX = 0;
    this._fScrollY = 0;
    this._fScrollingX = 0;
    this._fScrollingY = 0;
    this._fScrollOriginX = 0;
    this._fScrollOriginY = 0;
    this._fScrollMaxX = 0;
    this._fScrollMaxY = 0;
    this._fScrollMinX = 0;
    this._fScrollMinY = 0;
    this._fScrollerHeight = 0;
    this._bVertical = true;
    this._bHorizontal = false;
    this._inertia = 0;
    this._lastY = 0;
    this._oHandlers = {};
  }

  static get inertiaAttenuation() {
    return 0.94;
  }

  standardPadding() {
    return 2;
  }
  standardPaddingY() {
    return 2;
  }

  move(x, y, w, h) {
    super.move(x, y, w, h);
  }

  /**
   *
   * @param {string} symbol
   * @param {function} method
   */
  setHandler(symbol, method) {
    this._oHandlers[symbol] = method;
  }

  /**
   *
   * @param {string} symbol
   */
  isHandled(symbol) {
    return !!this._oHandlers[symbol];
  }

  /**
   *
   * @param {string} symbol
   */
  callHandler(symbol) {
    if (this.isHandled(symbol)) {
      this._oHandlers[symbol]();
    }
  }

  get scrollBarOffset() {
    return 4;
  }

  get scrollBarWidth() {
    return 4;
  }

  get scrollerHeight() {
    if (this._fScrollerHeight === 0) {
      let l = this._scrollBar.height + this._fScrollMinY / 4;
      this._fScrollerHeight = Math.max(l, 30);
    }
    return this._fScrollerHeight;
  }

  get scrollBarColor() {
    return "#000000";
  }

  get scrollerColor() {
    return "#000000";
  }

  createScrollBar() {
    let bg = new Sprite(
      new Bitmap(this.scrollBarWidth, this.height - 2 * this.scrollBarOffset)
    );
    bg.bitmap.fillRect(
      0,
      0,
      this.scrollBarWidth,
      this.height - 2 * this.scrollBarOffset,
      this.scrollBarColor
    );
    this._scrollBar = bg;
    this.addChild(bg);
    bg.move(this.width - this.scrollBarWidth - 4, this.scrollBarOffset);
  }

  createScroller() {
    let l = this.scrollerHeight;
    let item = new Sprite(new Bitmap(this.scrollBarWidth, l));
    item.bitmap.drawItemBox(
      0,
      0,
      this.scrollBarWidth,
      l,
      "img/system/",
      "window_scroller",
      0,
      2
    );
    this._scroller = item;
    this.addChild(item);
    item.move(this.width - this.scrollBarWidth - 4, this.scrollBarOffset);
  }

  processTouch() {
    if (TouchInput.isCancelled()) {
      this.processCancel();
    }
  }

  processCancel() {
    if (this.isHandled("cancel")) {
      SoundManager.playCancel();
      this.callHandler("cancel");
    }
  }

  contentsHeight() {
    return this.height - this.standardPaddingY() * 2 - this._fScrollMinY;
  }

  contentsWidth() {
    return this.width - this.standardPadding() * 2 - this._fScrollMinX;
  }

  /**
   *
   * @param fYmax {number}
   * @param fYmin {number}
   * @param fXmax {number}
   * @param fXmin {number}
   */
  setScrollLimit(fYmax, fYmin, fXmax, fXmin) {
    this._fScrollMaxX = fXmax;
    this._fScrollMaxY = fYmax;
    this._fScrollMinX = fXmin;
    this._fScrollMinY = fYmin;
    this.createContents();
    if (fYmin < 0) {
      this.createScrollBar();
      this.createScroller();
    }
  }

  /**
   *
   * @param horz {boolean}
   * @param vert {boolean}
   */
  setScrollDirection(horz, vert) {
    this._bVertical = vert;
    this._bHorizontal = horz;
  }

  get scrollX() {
    return this._fScrollX + this._fScrollingX;
  }

  get scrollY() {
    return this._fScrollY + this._fScrollingY;
  }

  resetScroll() {
    this._fScrollX = 0;
    this._fScrollY = 0;
  }

  update() {
    super.update();
    this.updateTouching();
    this.processScroll();
    this.updateScroll();
    this.updateContentScroll();
    this.updateScrollBar();
    this.processRelease();
    this.processTouch();
  }

  isMouseOver() {
    var x = this.parent.canvasToLocalX
      ? this.parent.canvasToLocalX(TouchInput.x)
      : TouchInput.x;
    var y = this.parent.canvasToLocalY
      ? this.parent.canvasToLocalY(TouchInput.y)
      : TouchInput.y;
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  updateTouching() {
    if (this.active) {
      if (TouchInput.isPressed() && this.isMouseOver()) {
        if (!this._bTouching) {
          this._fScrollOriginX = TouchInput.x;
          this._fScrollOriginY = TouchInput.y;
        }
        this._bTouching = true;
        this._bTouched = true;
      } else {
        this._bTouching = false;
        if (this._inertia > 1 || this._inertia < -1) {
          this._fScrollY += this._inertia;
          this._inertia = this._inertia * Window_Scroll.inertiaAttenuation;
        }
      }
    } else {
      this._bTouching = false;
    }
  }

  processRelease() {
    if (this.active) {
      if (!this._bTouching && this._bTouched) {
        this._fScrollX += this._fScrollingX;
        this._fScrollY += this._fScrollingY;
        this._fScrollingX = 0;
        this._fScrollingY = 0;
        this._bTouched = false;
      }
    } else {
      this._bTouching = false;
    }
  }

  processScroll() {
    if (this.active) {
      if (this._bTouching) {
        let x = TouchInput.x;
        let y = TouchInput.y;
        this._bHorizontal
          ? (this._fScrollingX = x - this._fScrollOriginX)
          : (this._fScrollingX = 0);
        this._bVertical
          ? (this._fScrollingY = y - this._fScrollOriginY)
          : (this._fScrollingY = 0);
        this._inertia = y - this._lastY;
        this._lastY = y;
      }
    }
  }

  updateScroll() {
    if (this._fScrollX > this._fScrollMaxX) {
      this._fScrollX -= (this._fScrollX - this._fScrollMaxX) / 3;
      if (this._fScrollX - this._fScrollMaxX < 1)
        this._fScrollX = this._fScrollMaxX;
    }
    if (this._fScrollY > this._fScrollMaxY) {
      this._fScrollY -= (this._fScrollY - this._fScrollMaxY) / 3;
      if (this._fScrollY - this._fScrollMaxY < 1)
        this._fScrollY = this._fScrollMaxY;
    }

    if (this._fScrollX < this._fScrollMinX) {
      this._fScrollX -= (this._fScrollX - this._fScrollMinX) / 3;
      if (this._fScrollMinX - this._fScrollX < 1)
        this._fScrollX = this._fScrollMinX;
    }
    if (this._fScrollY < this._fScrollMinY) {
      this._fScrollY -= (this._fScrollY - this._fScrollMinY) / 3;
      if (this._fScrollMinY - this._fScrollY < 1)
        this._fScrollY = this._fScrollMinY;
    }
  }

  updateScrollBar() {
    if (!this._scrollBar) return;
    this._scrollBar.move(
      this.width - this.scrollBarWidth - 4,
      this.scrollBarOffset
    );
    if (this._scroller) {
      let y =
        this.scrollBarOffset +
        ((this._scrollBar.height - this.scrollerHeight) * this.scrollY) /
          this._fScrollMinY;
      this._scroller.move(this.width - this.scrollBarWidth - 4, y);
      if (y + this.scrollerHeight > this.height - this.scrollBarOffset) {
        this._scroller.setFrame(
          0,
          0,
          this.scrollBarWidth,
          this.height - this.scrollBarOffset - y
        );
      } else if (y < this.scrollBarOffset) {
        this._scroller.move(
          this.width - this.scrollBarWidth - 4,
          this.scrollBarOffset
        );
        this._scroller.setFrame(
          0,
          this.scrollBarOffset,
          this.scrollBarWidth,
          this.scrollerHeight - (this.scrollBarOffset - y)
        );
      } else {
        this._scroller.setFrame(0, 0, this.scrollBarWidth, this.scrollerHeight);
      }
    }
  }

  updateContentScroll() {
    this.origin.x = -this.scrollX;
    this.origin.y = -this.scrollY;
  }
}

class Window_SelectableScroll extends Window_Scroll {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this._index = -1;
  }

  get index() {
    return this._index;
  }

  get maxCols() {
    return 1;
  }

  get maxItems() {
    return 0;
  }

  get spacing() {
    return 12;
  }

  get itemWidth() {
    return (
      (this.width - this.standardPadding() * 2) / this.maxCols - this.spacing
    );
  }

  get itemHeight() {
    return this.lineHeight();
  }

  get maxRows() {
    return Math.max(Math.ceil(this.maxItems / this.maxCols), 1);
  }
  get evaluateScrollLimitY() {
    return Math.min(
      this.height -
        (this.itemHeight + this.spacing) * this.maxRows -
        2 * this.standardPaddingY(),
      0
    );
  }
  get evaluateScrollLimitX() {
    return Math.min(
      this.width -
        (this.itemWidth + this.spacing) * this.maxCols -
        2 * this.standardPadding(),
      0
    );
  }
  get itemBox() {
    return ["img/system/", "itembox", 10];
  }
  get selectedBorder() {
    return ["img/system/", "itemboxframe", 8];
  }

  /**
   * determine if the selection is maintained while scroll;
   * @returns {boolean}
   */
  isSelectionMaintained() {
    return true;
  }
  /**
   * select indicated index
   * @param {number} index
   */
  select(index) {
    let last_index = this.index;
    this._index = index;
    this.redrawCurrentItem();
    this.redrawItem(last_index);
  }

  deselect() {
    this.select(-1);
  }

  reselect() {
    this.select(-1);
  }

  /**
   *
   * @param {number} index
   * @return {Rectangle}
   */
  itemRect(index) {
    let rect = new Rectangle();
    let maxCols = this.maxCols;
    rect.width = this.itemWidth;
    rect.height = this.itemHeight;
    rect.x =
      this.standardPadding() + (index % maxCols) * (rect.width + this.spacing);
    rect.y =
      this.standardPaddingY() + Math.floor(index / maxCols) * rect.height;
    return rect;
  }

  itemRectForText(index) {
    let rect = this.itemRect(index);
    rect.x += this.textPadding();
    rect.y += this.textPadding();
    rect.width -= this.textPadding() * 2;
    return rect;
  }

  isOpenAndActive() {
    return this.isOpen() && this.active;
  }

  update() {
    super.update();
    this.processHandling();
  }

  processHandling() {
    if (this.isOpenAndActive()) {
      if (this.isOkEnabled() && this.isOkTriggered()) {
        this.processOk();
      } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
        this.processCancel();
      }
    }
  }

  updateTouching() {
    if (this.active) {
      if (TouchInput.isPressed() && this.isMouseOver()) {
        if (!this._bTouching) {
          this._lastIndex = this.index;
          this._fScrollOriginX = TouchInput.x;
          this._fScrollOriginY = TouchInput.y;
        }
        if (this._fScrollingY > 1 || this._fScrollingX > 1) {
          if (!this.isSelectionMaintained()) this.select(-1);
        } else {
          let x = this.canvasToLocalX(TouchInput.x);
          let y = this.canvasToLocalY(TouchInput.y);
          let index = this.hitTest(x, y);
          if (index > -1) {
            this.select(index);
          }
        }
        this._bTouching = true;
        this._bTouched = true;
      } else {
        this._bTouching = false;
        if (this._inertia > 1 || this._inertia < -1) {
          this._fScrollY += this._inertia;
          this._inertia = this._inertia * Window_Scroll.inertiaAttenuation;
        }
      }
    } else {
      this._bTouching = false;
    }
  }

  processRelease() {
    if (this.active) {
      if (!this._bTouching && this._bTouched) {
        this._fScrollX += this._fScrollingX;
        this._fScrollY += this._fScrollingY;
        if (this._fScrollingY === 0 && this._fScrollingX === 0) {
          this.processClick();
        } else {
          this.select(-1);
        }
        this._fScrollingX = 0;
        this._fScrollingY = 0;
        this._bTouched = false;
      }
    } else {
      this._bTouching = false;
    }
  }

  processClick() {
    let lastIndex = this.index;
    let x = this.canvasToLocalX(TouchInput.x);
    let y = this.canvasToLocalY(TouchInput.y);
    let hitIndex = this.hitTest(x, y);
    if (hitIndex >= 0) {
      this.select(hitIndex);
      if (hitIndex === this.index) {
        if (this.isOkEnabled()) {
          this.processOk();
        }
      } else {
        this.select(hitIndex);
      }
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  hitTest(x, y) {
    if (this.isContentsArea(x, y)) {
      let cx = x - this.scrollX - this.standardPadding();
      let cy = y - this.scrollY - this.standardPaddingY();
      for (let i = 0; i < this.maxItems; i++) {
        let rect = this.itemRect(i);
        let right = rect.x + rect.width;
        let bottom = rect.y + rect.height;
        if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
          return i;
        }
      }
    }
    return -1;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  isContentsArea(x, y) {
    let left = this.standardPadding();
    let top = this.standardPaddingY();
    let right = this.width - this.standardPadding();
    let bottom = this.height - this.standardPaddingY();
    return x >= left && y >= top && x < right && y < bottom;
  }

  isOkEnabled() {
    return this.isHandled("ok");
  }

  isCancelEnabled() {
    return this.isHandled("cancel");
  }

  isOkTriggered() {
    return Input.isRepeated("ok");
  }

  isCancelTriggered() {
    return Input.isRepeated("cancel");
  }

  processOk() {
    if (this.isCurrentItemEnabled()) {
      this.playOkSound();
      this.updateInputData();
      this.callOkHandler();
    } else {
      this.playBuzzerSound();
    }
  }

  playBuzzerSound() {
    SoundManager.playBuzzer();
  }

  playOkSound() {
    SoundManager.playOk();
  }

  callOkHandler() {
    this.callHandler("ok");
  }

  processCancel() {
    if (this.isHandled("cancel")) {
      SoundManager.playCancel();
      this.updateInputData();
      this.callCancelHandler();
    }
  }

  callCancelHandler() {
    this.callHandler("cancel");
  }

  updateInputData() {
    Input.update();
    TouchInput.update();
  }

  isCurrentItemEnabled() {
    return true;
  }

  drawAllItems() {
    for (let i = 0; i < this.maxItems; i++) {
      this.drawItem(i);
    }
  }

  /**
   *
   * @param {number} index
   */
  clearItem(index) {
    let rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
  }

  /**
   *
   * @param {number} index
   */
  drawItem(index) {}

  /**
   *
   * @param {number} index
   */
  redrawItem(index) {
    if (index >= 0) {
      this.clearItem(index);
      this.drawItem(index);
    }
  }

  redrawCurrentItem() {
    this.redrawItem(this.index);
  }

  updateScrollLimit() {}

  refresh() {
    this.updateScrollLimit();
    this.drawAllItems();
  }
}
