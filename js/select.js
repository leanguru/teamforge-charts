/*!
 * ui-select
 * http://github.com/angular-ui/ui-select
 * Version: 0.17.1 - 2016-06-09T20:41:58.363Z
 * License: MIT
 */
!function () {
    "use strict";
    var e = {TAB: 9, ENTER: 13, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SHIFT: 16, CTRL: 17, ALT: 18, PAGE_UP: 33, PAGE_DOWN: 34, HOME: 36, END: 35, BACKSPACE: 8, DELETE: 46, COMMAND: 91, MAP: {91: "COMMAND", 8: "BACKSPACE", 9: "TAB", 13: "ENTER", 16: "SHIFT", 17: "CTRL", 18: "ALT", 19: "PAUSEBREAK", 20: "CAPSLOCK", 27: "ESC", 32: "SPACE", 33: "PAGE_UP", 34: "PAGE_DOWN", 35: "END", 36: "HOME", 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN", 43: "+", 44: "PRINTSCREEN", 45: "INSERT", 46: "DELETE", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 59: ";", 61: "=", 65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z", 96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NUMLOCK", 145: "SCROLLLOCK", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"}, isControl: function (t) {
        var i = t.which;
        switch (i) {
            case e.COMMAND:
            case e.SHIFT:
            case e.CTRL:
            case e.ALT:
                return!0
        }
        return!!(t.metaKey || t.ctrlKey || t.altKey)
    }, isFunctionKey: function (e) {
        return e = e.which ? e.which : e, e >= 112 && 123 >= e
    }, isVerticalMovement: function (t) {
        return~[e.UP, e.DOWN].indexOf(t)
    }, isHorizontalMovement: function (t) {
        return~[e.LEFT, e.RIGHT, e.BACKSPACE, e.DELETE].indexOf(t)
    }, toSeparator: function (t) {
        var i = {ENTER: "\n", TAB: "	", SPACE: " "}[t];
        return i ? i : e[t] ? void 0 : t
    }};
    void 0 === angular.element.prototype.querySelectorAll && (angular.element.prototype.querySelectorAll = function (e) {
        return angular.element(this[0].querySelectorAll(e))
    }), void 0 === angular.element.prototype.closest && (angular.element.prototype.closest = function (e) {
        for (var t = this[0], i = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector; t;) {
            if (i.bind(t)(e))return t;
            t = t.parentElement
        }
        return!1
    });
    var t = 0, i = angular.module("ui.select", []).constant("uiSelectConfig", {theme: "bootstrap", searchEnabled: !0, sortable: !1, placeholder: "", refreshDelay: 1e3, closeOnSelect: !0, skipFocusser: !1, dropdownPosition: "auto", removeSelected: !0, generateId: function () {
        return t++
    }, appendToBody: !1}).service("uiSelectMinErr", function () {
        var e = angular.$$minErr("ui.select");
        return function () {
            var t = e.apply(this, arguments), i = t.message.replace(new RegExp("\nhttp://errors.angularjs.org/.*"), "");
            return new Error(i)
        }
    }).directive("uisTranscludeAppend", function () {
        return{link: function (e, t, i, c, s) {
            s(e, function (e) {
                t.append(e)
            })
        }}
    }).filter("highlight", function () {
        function e(e) {
            return("" + e).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
        }

        return function (t, i) {
            return i && t ? ("" + t).replace(new RegExp(e(i), "gi"), '<span class="ui-select-highlight">$&</span>') : t
        }
    }).factory("uisOffset", ["$document", "$window", function (e, t) {
        return function (i) {
            var c = i[0].getBoundingClientRect();
            return{width: c.width || i.prop("offsetWidth"), height: c.height || i.prop("offsetHeight"), top: c.top + (t.pageYOffset || e[0].documentElement.scrollTop), left: c.left + (t.pageXOffset || e[0].documentElement.scrollLeft)}
        }
    }]);
    i.directive("uiSelectChoices", ["uiSelectConfig", "uisRepeatParser", "uiSelectMinErr", "$compile", "$window", function (e, t, i, c, s) {
        return{restrict: "EA", require: "^uiSelect", replace: !0, transclude: !0, templateUrl: function (t) {
            t.addClass("ui-select-choices");
            var i = t.parent().attr("theme") || e.theme;
            return i + "/choices.tpl.html"
        }, compile: function (c, l) {
            if (!l.repeat)throw i("repeat", "Expected 'repeat' expression.");
            var n = l.groupBy, a = l.groupFilter;
            if (n) {
                var r = c.querySelectorAll(".ui-select-choices-group");
                if (1 !== r.length)throw i("rows", "Expected 1 .ui-select-choices-group but got '{0}'.", r.length);
                r.attr("ng-repeat", t.getGroupNgRepeatExpression())
            }
            var o = t.parse(l.repeat), u = c.querySelectorAll(".ui-select-choices-row");
            if (1 !== u.length)throw i("rows", "Expected 1 .ui-select-choices-row but got '{0}'.", u.length);
            u.attr("ng-repeat", o.repeatExpression(n)).attr("ng-if", "$select.open");
            var d = c.querySelectorAll(".ui-select-choices-row-inner");
            if (1 !== d.length)throw i("rows", "Expected 1 .ui-select-choices-row-inner but got '{0}'.", d.length);
            d.attr("uis-transclude-append", "");
            var p = s.document.addEventListener ? u : d;
            return p.attr("ng-click", "$select.select(" + o.itemName + ",$select.skipFocusser,$event)"), function (t, i, c, s) {
                s.parseRepeatAttr(c.repeat, n, a), s.disableChoiceExpression = c.uiDisableChoice, s.onHighlightCallback = c.onHighlight, s.dropdownPosition = c.position ? c.position.toLowerCase() : e.dropdownPosition, t.$on("$destroy", function () {
                    u.remove()
                }), t.$watch("$select.search", function (e) {
                    e && !s.open && s.multiple && s.activate(!1, !0), s.activeIndex = s.tagging.isActivated ? -1 : 0, !c.minimumInputLength || s.search.length >= c.minimumInputLength ? s.refresh(c.refresh) : s.items = []
                }), c.$observe("refreshDelay", function () {
                    var i = t.$eval(c.refreshDelay);
                    s.refreshDelay = void 0 !== i ? i : e.refreshDelay
                })
            }
        }}
    }]), i.controller("uiSelectCtrl", ["$scope", "$element", "$timeout", "$filter", "$$uisDebounce", "uisRepeatParser", "uiSelectMinErr", "uiSelectConfig", "$parse", "$injector", "$window", function (t, i, c, s, l, n, a, r, o, u, d) {
        function p(e, t, i) {
            if (e.findIndex)return e.findIndex(t, i);
            for (var c, s = Object(e), l = s.length >>> 0, n = 0; l > n; n++)if (c = s[n], t.call(i, c, n, s))return n;
            return-1
        }

        function h() {
            (m.resetSearchInput || void 0 === m.resetSearchInput && r.resetSearchInput) && (m.search = $, m.selected && m.items.length && !m.multiple && (m.activeIndex = p(m.items, function (e) {
                return angular.equals(this, e)
            }, m.selected)))
        }

        function g(e, t) {
            var i, c, s = [];
            for (i = 0; i < t.length; i++)for (c = 0; c < e.length; c++)e[c].name == [t[i]] && s.push(e[c]);
            return s
        }

        function f(t) {
            var i = !0;
            switch (t) {
                case e.DOWN:
                    !m.open && m.multiple ? m.activate(!1, !0) : m.activeIndex < m.items.length - 1 && m.activeIndex++;
                    break;
                case e.UP:
                    !m.open && m.multiple ? m.activate(!1, !0) : (m.activeIndex > 0 || 0 === m.search.length && m.tagging.isActivated && m.activeIndex > -1) && m.activeIndex--;
                    break;
                case e.TAB:
                    m.multiple && !m.open || m.select(m.items[m.activeIndex], !0);
                    break;
                case e.ENTER:
                    m.open && (m.tagging.isActivated || m.activeIndex >= 0) ? m.select(m.items[m.activeIndex], m.skipFocusser) : m.activate(!1, !0);
                    break;
                case e.ESC:
                    m.close();
                    break;
                default:
                    i = !1
            }
            return i
        }

        function v() {
            var e = i.querySelectorAll(".ui-select-choices-content"), t = e.querySelectorAll(".ui-select-choices-row");
            if (t.length < 1)throw a("choices", "Expected multiple .ui-select-choices-row but got '{0}'.", t.length);
            if (!(m.activeIndex < 0)) {
                var c = t[m.activeIndex], s = c.offsetTop + c.clientHeight - e[0].scrollTop, l = e[0].offsetHeight;
                s > l ? e[0].scrollTop += s - l : s < c.clientHeight && (m.isGrouped && 0 === m.activeIndex ? e[0].scrollTop = 0 : e[0].scrollTop -= c.clientHeight - s)
            }
        }

        var m = this, $ = "";
        if (m.placeholder = r.placeholder, m.searchEnabled = r.searchEnabled, m.sortable = r.sortable, m.refreshDelay = r.refreshDelay, m.paste = r.paste, m.removeSelected = r.removeSelected, m.closeOnSelect = !0, m.skipFocusser = !1, m.search = $, m.activeIndex = 0, m.items = [], m.open = !1, m.focus = !1, m.disabled = !1, m.selected = void 0, m.dropdownPosition = "auto", m.focusser = void 0, m.resetSearchInput = !0, m.multiple = void 0, m.disableChoiceExpression = void 0, m.tagging = {isActivated: !1, fct: void 0}, m.taggingTokens = {isActivated: !1, tokens: void 0}, m.lockChoiceExpression = void 0, m.clickTriggeredSelect = !1, m.$filter = s, m.$element = i, m.$animate = function () {
            try {
                return u.get("$animate")
            } catch (e) {
                return null
            }
        }(), m.searchInput = i.querySelectorAll("input.ui-select-search"), 1 !== m.searchInput.length)throw a("searchInput", "Expected 1 input.ui-select-search but got '{0}'.", m.searchInput.length);
        m.isEmpty = function () {
            return angular.isUndefined(m.selected) || null === m.selected || "" === m.selected || m.multiple && 0 === m.selected.length
        }, m.activate = function (e, s) {
            if (!m.disabled && !m.open) {
                s || h(), t.$broadcast("uis:activate"), m.open = !0, m.activeIndex = m.activeIndex >= m.items.length ? 0 : m.activeIndex, -1 === m.activeIndex && m.taggingLabel !== !1 && (m.activeIndex = 0);
                var l = i.querySelectorAll(".ui-select-choices-content"), n = i.querySelectorAll(".ui-select-search");
                if (m.$animate && m.$animate.on && m.$animate.enabled(l[0])) {
                    var a = function (t, i) {
                        "start" === i && 0 === m.items.length ? (m.$animate.off("removeClass", n[0], a), c(function () {
                            m.focusSearchInput(e)
                        })) : "close" === i && (m.$animate.off("enter", l[0], a), c(function () {
                            m.focusSearchInput(e)
                        }))
                    };
                    m.items.length > 0 ? m.$animate.on("enter", l[0], a) : m.$animate.on("removeClass", n[0], a)
                } else c(function () {
                    m.focusSearchInput(e), !m.tagging.isActivated && m.items.length > 1 && v()
                })
            }
        }, m.focusSearchInput = function (e) {
            m.search = e || m.search, m.searchInput[0].focus()
        }, m.findGroupByName = function (e) {
            return m.groups && m.groups.filter(function (t) {
                return t.name === e
            })[0]
        }, m.parseRepeatAttr = function (e, i, c) {
            function s(e) {
                var s = t.$eval(i);
                if (m.groups = [], angular.forEach(e, function (e) {
                    var t = angular.isFunction(s) ? s(e) : e[s], i = m.findGroupByName(t);
                    i ? i.items.push(e) : m.groups.push({name: t, items: [e]})
                }), c) {
                    var l = t.$eval(c);
                    angular.isFunction(l) ? m.groups = l(m.groups) : angular.isArray(l) && (m.groups = g(m.groups, l))
                }
                m.items = [], m.groups.forEach(function (e) {
                    m.items = m.items.concat(e.items)
                })
            }

            function l(e) {
                m.items = e
            }

            m.setItemsFn = i ? s : l, m.parserResult = n.parse(e), m.isGrouped = !!i, m.itemProperty = m.parserResult.itemName;
            var r = m.parserResult.source, u = function () {
                var e = r(t);
                t.$uisSource = Object.keys(e).map(function (t) {
                    var i = {};
                    return i[m.parserResult.keyName] = t, i.value = e[t], i
                })
            };
            m.parserResult.keyName && (u(), m.parserResult.source = o("$uisSource" + m.parserResult.filters), t.$watch(r, function (e, t) {
                e !== t && u()
            }, !0)), m.refreshItems = function (e) {
                e = e || m.parserResult.source(t);
                var i = m.selected;
                if (m.isEmpty() || angular.isArray(i) && !i.length || !m.removeSelected)m.setItemsFn(e); else if (void 0 !== e && null !== e) {
                    var c = e.filter(function (e) {
                        return angular.isArray(i) ? i.every(function (t) {
                            return!angular.equals(e, t)
                        }) : !angular.equals(e, i)
                    });
                    m.setItemsFn(c)
                }
                "auto" !== m.dropdownPosition && "up" !== m.dropdownPosition || t.calculateDropdownPos(), t.$broadcast("uis:refresh")
            }, t.$watchCollection(m.parserResult.source, function (e) {
                if (void 0 === e || null === e)m.items = []; else {
                    if (!angular.isArray(e))throw a("items", "Expected an array but got '{0}'.", e);
                    m.refreshItems(e), angular.isDefined(m.ngModel.$modelValue) && (m.ngModel.$modelValue = null)
                }
            })
        };
        var b;
        m.refresh = function (e) {
            void 0 !== e && (b && c.cancel(b), b = c(function () {
                t.$eval(e)
            }, m.refreshDelay))
        }, m.isActive = function (e) {
            if (!m.open)return!1;
            var t = m.items.indexOf(e[m.itemProperty]), i = t == m.activeIndex;
            return!i || 0 > t ? !1 : (i && !angular.isUndefined(m.onHighlightCallback) && e.$eval(m.onHighlightCallback), i)
        };
        var w = function (e) {
            return m.selected && angular.isArray(m.selected) && m.selected.filter(function (t) {
                return angular.equals(t, e)
            }).length > 0
        };
        m.isDisabled = function (e) {
            if (m.open) {
                var t, i = m.items.indexOf(e[m.itemProperty]), c = !1;
                return i >= 0 && (!angular.isUndefined(m.disableChoiceExpression) || m.multiple) && (t = m.items[i], c = !!e.$eval(m.disableChoiceExpression) || w(t), t._uiSelectChoiceDisabled = c), c
            }
        }, m.select = function (e, i, s) {
            if (void 0 === e || !e._uiSelectChoiceDisabled) {
                if (!m.items && !m.search && !m.tagging.isActivated)return;
                if (!e || !e._uiSelectChoiceDisabled) {
                    if (m.tagging.isActivated) {
                        if (m.taggingLabel === !1)if (m.activeIndex < 0) {
                            if (e = void 0 !== m.tagging.fct ? m.tagging.fct(m.search) : m.search, !e || angular.equals(m.items[0], e))return
                        } else e = m.items[m.activeIndex]; else if (0 === m.activeIndex) {
                            if (void 0 === e)return;
                            if (void 0 !== m.tagging.fct && "string" == typeof e) {
                                if (e = m.tagging.fct(e), !e)return
                            } else"string" == typeof e && (e = e.replace(m.taggingLabel, "").trim())
                        }
                        if (w(e))return void m.close(i)
                    }
                    t.$broadcast("uis:select", e);
                    var l = {};
                    l[m.parserResult.itemName] = e, c(function () {
                        m.onSelectCallback(t, {$item: e, $model: m.parserResult.modelMapper(t, l)})
                    }), m.closeOnSelect && m.close(i), s && "click" === s.type && (m.clickTriggeredSelect = !0)
                }
            }
        }, m.close = function (e) {
            m.open && (m.ngModel && m.ngModel.$setTouched && m.ngModel.$setTouched(), h(), m.open = !1, t.$broadcast("uis:close", e))
        }, m.setFocus = function () {
            m.focus || m.focusInput[0].focus()
        }, m.clear = function (e) {
            m.select(void 0), e.stopPropagation(), c(function () {
                m.focusser[0].focus()
            }, 0, !1)
        }, m.toggle = function (e) {
            m.open ? (m.close(), e.preventDefault(), e.stopPropagation()) : m.activate()
        }, m.isLocked = function (e, t) {
            var i, c = m.selected[t];
            return c && !angular.isUndefined(m.lockChoiceExpression) && (i = !!e.$eval(m.lockChoiceExpression), c._uiSelectChoiceLocked = i), i
        };
        var y = null, x = !1;
        m.sizeSearchInput = function () {
            var e = m.searchInput[0], i = m.searchInput.parent().parent()[0], s = function () {
                return i.clientWidth * !!e.offsetParent
            }, l = function (t) {
                if (0 === t)return!1;
                var i = t - e.offsetLeft - 10;
                return 50 > i && (i = t), m.searchInput.css("width", i + "px"), !0
            };
            m.searchInput.css("width", "10px"), c(function () {
                null !== y || l(s()) || (y = t.$watch(function () {
                    x || (x = !0, t.$$postDigest(function () {
                        x = !1, l(s()) && (y(), y = null)
                    }))
                }, angular.noop))
            })
        }, m.searchInput.on("keydown", function (i) {
            var s = i.which;
            ~[e.ENTER, e.ESC].indexOf(s) && (i.preventDefault(), i.stopPropagation()), t.$apply(function () {
                var t = !1;
                if ((m.items.length > 0 || m.tagging.isActivated) && (f(s), m.taggingTokens.isActivated)) {
                    for (var l = 0; l < m.taggingTokens.tokens.length; l++)m.taggingTokens.tokens[l] === e.MAP[i.keyCode] && m.search.length > 0 && (t = !0);
                    t && c(function () {
                        m.searchInput.triggerHandler("tagged");
                        var t = m.search.replace(e.MAP[i.keyCode], "").trim();
                        m.tagging.fct && (t = m.tagging.fct(t)), t && m.select(t, !0)
                    })
                }
            }), e.isVerticalMovement(s) && m.items.length > 0 && v(), s !== e.ENTER && s !== e.ESC || (i.preventDefault(), i.stopPropagation())
        }), m.searchInput.on("paste", function (t) {
            var i;
            if (i = window.clipboardData && window.clipboardData.getData ? window.clipboardData.getData("Text") : (t.originalEvent || t).clipboardData.getData("text/plain"), i = m.search + i, i && i.length > 0)if (m.taggingTokens.isActivated) {
                for (var c = [], s = 0; s < m.taggingTokens.tokens.length; s++) {
                    var l = e.toSeparator(m.taggingTokens.tokens[s]) || m.taggingTokens.tokens[s];
                    if (i.indexOf(l) > -1) {
                        c = i.split(l);
                        break
                    }
                }
                if (0 === c.length && (c = [i]), c.length > 0) {
                    var n = m.search;
                    angular.forEach(c, function (e) {
                        var t = m.tagging.fct ? m.tagging.fct(e) : e;
                        t && m.select(t, !0)
                    }), m.search = n || $, t.preventDefault(), t.stopPropagation()
                }
            } else m.paste && (m.paste(i), m.search = $, t.preventDefault(), t.stopPropagation())
        }), m.searchInput.on("tagged", function () {
            c(function () {
                h()
            })
        });
        var E = l(function () {
            m.sizeSearchInput()
        }, 50);
        angular.element(d).bind("resize", E), t.$on("$destroy", function () {
            m.searchInput.off("keyup keydown tagged blur paste"), angular.element(d).off("resize", E)
        })
    }]), i.directive("uiSelect", ["$document", "uiSelectConfig", "uiSelectMinErr", "uisOffset", "$compile", "$parse", "$timeout", function (e, t, i, c, s, l, n) {
        return{restrict: "EA", templateUrl: function (e, i) {
            var c = i.theme || t.theme;
            return c + (angular.isDefined(i.multiple) ? "/select-multiple.tpl.html" : "/select.tpl.html")
        }, replace: !0, transclude: !0, require: ["uiSelect", "^ngModel"], scope: !0, controller: "uiSelectCtrl", controllerAs: "$select", compile: function (s, a) {
            var r = /{(.*)}\s*{(.*)}/.exec(a.ngClass);
            if (r) {
                var o = "{" + r[1] + ", " + r[2] + "}";
                a.ngClass = o, s.attr("ng-class", o)
            }
            return angular.isDefined(a.multiple) ? s.append("<ui-select-multiple/>").removeAttr("multiple") : s.append("<ui-select-single/>"), a.inputId && (s.querySelectorAll("input.ui-select-search")[0].id = a.inputId), function (s, a, r, o, u) {
                function d(e) {
                    if (g.open) {
                        var t = !1;
                        if (t = window.jQuery ? window.jQuery.contains(a[0], e.target) : a[0].contains(e.target), !t && !g.clickTriggeredSelect) {
                            var i;
                            if (g.skipFocusser)i = !0; else {
                                var c = ["input", "button", "textarea", "select"], l = angular.element(e.target).controller("uiSelect");
                                i = l && l !== g, i || (i = ~c.indexOf(e.target.tagName.toLowerCase()))
                            }
                            g.close(i), s.$digest()
                        }
                        g.clickTriggeredSelect = !1
                    }
                }

                function p() {
                    var t = c(a);
                    m = angular.element('<div class="ui-select-placeholder"></div>'), m[0].style.width = t.width + "px", m[0].style.height = t.height + "px", a.after(m), $ = a[0].style.width, e.find("body").append(a), a[0].style.position = "absolute", a[0].style.left = t.left + "px", a[0].style.top = t.top + "px", a[0].style.width = t.width + "px"
                }

                function h() {
                    null !== m && (m.replaceWith(a), m = null, a[0].style.position = "", a[0].style.left = "", a[0].style.top = "", a[0].style.width = $, g.setFocus())
                }

                var g = o[0], f = o[1];
                g.generatedId = t.generateId(), g.baseTitle = r.title || "Select box", g.focusserTitle = g.baseTitle + " focus", g.focusserId = "focusser-" + g.generatedId, g.closeOnSelect = function () {
                    return angular.isDefined(r.closeOnSelect) ? l(r.closeOnSelect)() : t.closeOnSelect
                }(), s.$watch("skipFocusser", function () {
                    var e = s.$eval(r.skipFocusser);
                    g.skipFocusser = void 0 !== e ? e : t.skipFocusser
                }), g.onSelectCallback = l(r.onSelect), g.onRemoveCallback = l(r.onRemove), g.ngModel = f, g.choiceGrouped = function (e) {
                    return g.isGrouped && e && e.name
                }, r.tabindex && r.$observe("tabindex", function (e) {
                    g.focusInput.attr("tabindex", e), a.removeAttr("tabindex")
                }), s.$watch("searchEnabled", function () {
                    var e = s.$eval(r.searchEnabled);
                    g.searchEnabled = void 0 !== e ? e : t.searchEnabled
                }), s.$watch("sortable", function () {
                    var e = s.$eval(r.sortable);
                    g.sortable = void 0 !== e ? e : t.sortable
                }), r.$observe("limit", function () {
                    g.limit = angular.isDefined(r.limit) ? parseInt(r.limit, 10) : void 0
                }), s.$watch("removeSelected", function () {
                    var e = s.$eval(r.removeSelected);
                    g.removeSelected = void 0 !== e ? e : t.removeSelected
                }), r.$observe("disabled", function () {
                    g.disabled = void 0 !== r.disabled ? r.disabled : !1
                }), r.$observe("resetSearchInput", function () {
                    var e = s.$eval(r.resetSearchInput);
                    g.resetSearchInput = void 0 !== e ? e : !0
                }), r.$observe("paste", function () {
                    g.paste = s.$eval(r.paste)
                }), r.$observe("tagging", function () {
                    if (void 0 !== r.tagging) {
                        var e = s.$eval(r.tagging);
                        g.tagging = {isActivated: !0, fct: e !== !0 ? e : void 0}
                    } else g.tagging = {isActivated: !1, fct: void 0}
                }), r.$observe("taggingLabel", function () {
                    void 0 !== r.tagging && ("false" === r.taggingLabel ? g.taggingLabel = !1 : g.taggingLabel = void 0 !== r.taggingLabel ? r.taggingLabel : "(new)")
                }), r.$observe("taggingTokens", function () {
                    if (void 0 !== r.tagging) {
                        var e = void 0 !== r.taggingTokens ? r.taggingTokens.split("|") : [",", "ENTER"];
                        g.taggingTokens = {isActivated: !0, tokens: e}
                    }
                }), angular.isDefined(r.autofocus) && n(function () {
                    g.setFocus()
                }), angular.isDefined(r.focusOn) && s.$on(r.focusOn, function () {
                    n(function () {
                        g.setFocus()
                    })
                }), e.on("click", d), s.$on("$destroy", function () {
                    e.off("click", d)
                }), u(s, function (e) {
                    var t = angular.element("<div>").append(e), c = t.querySelectorAll(".ui-select-match");
                    if (c.removeAttr("ui-select-match"), c.removeAttr("data-ui-select-match"), 1 !== c.length)throw i("transcluded", "Expected 1 .ui-select-match but got '{0}'.", c.length);
                    a.querySelectorAll(".ui-select-match").replaceWith(c);
                    var s = t.querySelectorAll(".ui-select-choices");
                    if (s.removeAttr("ui-select-choices"), s.removeAttr("data-ui-select-choices"), 1 !== s.length)throw i("transcluded", "Expected 1 .ui-select-choices but got '{0}'.", s.length);
                    a.querySelectorAll(".ui-select-choices").replaceWith(s);
                    var l = t.querySelectorAll(".ui-select-no-choice");
                    l.removeAttr("ui-select-no-choice"), l.removeAttr("data-ui-select-no-choice"), 1 == l.length && a.querySelectorAll(".ui-select-no-choice").replaceWith(l)
                });
                var v = s.$eval(r.appendToBody);
                (void 0 !== v ? v : t.appendToBody) && (s.$watch("$select.open", function (e) {
                    e ? p() : h()
                }), s.$on("$destroy", function () {
                    h()
                }));
                var m = null, $ = "", b = null, w = "direction-up";
                s.$watch("$select.open", function () {
                    "auto" !== g.dropdownPosition && "up" !== g.dropdownPosition || s.calculateDropdownPos()
                });
                var y = function (e, t) {
                    e = e || c(a), t = t || c(b), b[0].style.position = "absolute", b[0].style.top = -1 * t.height + "px", a.addClass(w)
                }, x = function (e, t) {
                    a.removeClass(w), e = e || c(a), t = t || c(b), b[0].style.position = "", b[0].style.top = ""
                }, E = function () {
                    n(function () {
                        if ("up" === g.dropdownPosition)y(); else {
                            a.removeClass(w);
                            var t = c(a), i = c(b), s = e[0].documentElement.scrollTop || e[0].body.scrollTop;
                            t.top + t.height + i.height > s + e[0].documentElement.clientHeight ? y(t, i) : x(t, i)
                        }
                        b[0].style.opacity = 1
                    })
                };
                s.calculateDropdownPos = function () {
                    if (g.open) {
                        if (b = angular.element(a).querySelectorAll(".ui-select-dropdown"), 0 === b.length)return;
                        if (b[0].style.opacity = 0, !c(b).height && g.$animate && g.$animate.on && g.$animate.enabled(b)) {
                            var e = !0;
                            g.$animate.on("enter", b, function (t, i) {
                                "close" === i && e && (E(), e = !1)
                            })
                        } else E()
                    } else {
                        if (null === b || 0 === b.length)return;
                        b[0].style.opacity = 0, b[0].style.position = "", b[0].style.top = "", a.removeClass(w)
                    }
                }
            }
        }}
    }]), i.directive("uiSelectMatch", ["uiSelectConfig", function (e) {
        function t(e, t) {
            return e[0].hasAttribute(t) ? e.attr(t) : e[0].hasAttribute("data-" + t) ? e.attr("data-" + t) : e[0].hasAttribute("x-" + t) ? e.attr("x-" + t) : void 0
        }

        return{restrict: "EA", require: "^uiSelect", replace: !0, transclude: !0, templateUrl: function (i) {
            i.addClass("ui-select-match");
            var c = i.parent(), s = t(c, "theme") || e.theme, l = angular.isDefined(t(c, "multiple"));
            return s + (l ? "/match-multiple.tpl.html" : "/match.tpl.html")
        }, link: function (t, i, c, s) {
            function l(e) {
                s.allowClear = angular.isDefined(e) ? "" === e ? !0 : "true" === e.toLowerCase() : !1
            }

            s.lockChoiceExpression = c.uiLockChoice, c.$observe("placeholder", function (t) {
                s.placeholder = void 0 !== t ? t : e.placeholder
            }), c.$observe("allowClear", l), l(c.allowClear), s.multiple && s.sizeSearchInput()
        }}
    }]), i.directive("uiSelectMultiple", ["uiSelectMinErr", "$timeout", function (t, i) {
        return{restrict: "EA", require: ["^uiSelect", "^ngModel"], controller: ["$scope", "$timeout", function (e, t) {
            var i, c = this, s = e.$select;
            angular.isUndefined(s.selected) && (s.selected = []), e.$evalAsync(function () {
                i = e.ngModel
            }), c.activeMatchIndex = -1, c.updateModel = function () {
                i.$setViewValue(Date.now()), c.refreshComponent()
            }, c.refreshComponent = function () {
                s.refreshItems(), s.sizeSearchInput()
            }, c.removeChoice = function (i) {
                var l = s.selected[i];
                if (!l._uiSelectChoiceLocked) {
                    var n = {};
                    n[s.parserResult.itemName] = l, s.selected.splice(i, 1), c.activeMatchIndex = -1, s.sizeSearchInput(), t(function () {
                        s.onRemoveCallback(e, {$item: l, $model: s.parserResult.modelMapper(e, n)})
                    }), c.updateModel()
                }
            }, c.getPlaceholder = function () {
                return s.selected && s.selected.length ? void 0 : s.placeholder
            }
        }], controllerAs: "$selectMultiple", link: function (c, s, l, n) {
            function a(e) {
                return angular.isNumber(e.selectionStart) ? e.selectionStart : e.value.length
            }

            function r(t) {
                function i() {
                    switch (t) {
                        case e.LEFT:
                            return~h.activeMatchIndex ? u : n;
                        case e.RIGHT:
                            return~h.activeMatchIndex && r !== n ? o : (d.activate(), !1);
                        case e.BACKSPACE:
                            return~h.activeMatchIndex ? (h.removeChoice(r), u) : n;
                        case e.DELETE:
                            return~h.activeMatchIndex ? (h.removeChoice(h.activeMatchIndex), r) : !1
                    }
                }

                var c = a(d.searchInput[0]), s = d.selected.length, l = 0, n = s - 1, r = h.activeMatchIndex, o = h.activeMatchIndex + 1, u = h.activeMatchIndex - 1, p = r;
                return c > 0 || d.search.length && t == e.RIGHT ? !1 : (d.close(), p = i(), d.selected.length && p !== !1 ? h.activeMatchIndex = Math.min(n, Math.max(l, p)) : h.activeMatchIndex = -1, !0)
            }

            function o(e) {
                if (void 0 === e || void 0 === d.search)return!1;
                var t = e.filter(function (e) {
                    return void 0 === d.search.toUpperCase() || void 0 === e ? !1 : e.toUpperCase() === d.search.toUpperCase()
                }).length > 0;
                return t
            }

            function u(e, t) {
                var i = -1;
                if (angular.isArray(e))for (var c = angular.copy(e), s = 0; s < c.length; s++)if (void 0 === d.tagging.fct)c[s] + " " + d.taggingLabel === t && (i = s); else {
                    var l = c[s];
                    angular.isObject(l) && (l.isTag = !0), angular.equals(l, t) && (i = s)
                }
                return i
            }

            var d = n[0], p = c.ngModel = n[1], h = c.$selectMultiple;
            d.multiple = !0, d.focusInput = d.searchInput, p.$isEmpty = function (e) {
                return!e || 0 === e.length
            }, p.$parsers.unshift(function () {
                for (var e, t = {}, i = [], s = d.selected.length - 1; s >= 0; s--)t = {}, t[d.parserResult.itemName] = d.selected[s], e = d.parserResult.modelMapper(c, t), i.unshift(e);
                return i
            }), p.$formatters.unshift(function (e) {
                var t, i = d.parserResult && d.parserResult.source(c, {$select: {search: ""}}), s = {};
                if (!i)return e;
                var l = [], n = function (e, i) {
                    if (e && e.length) {
                        for (var n = e.length - 1; n >= 0; n--) {
                            if (s[d.parserResult.itemName] = e[n], t = d.parserResult.modelMapper(c, s), d.parserResult.trackByExp) {
                                var a = /(\w*)\./.exec(d.parserResult.trackByExp), r = /\.([^\s]+)/.exec(d.parserResult.trackByExp);
                                if (a && a.length > 0 && a[1] == d.parserResult.itemName && r && r.length > 0 && t[r[1]] == i[r[1]])return l.unshift(e[n]), !0
                            }
                            if (angular.equals(t, i))return l.unshift(e[n]), !0
                        }
                        return!1
                    }
                };
                if (!e)return l;
                for (var a = e.length - 1; a >= 0; a--)n(d.selected, e[a]) || n(i, e[a]) || l.unshift(e[a]);
                return l
            }), c.$watchCollection(function () {
                return p.$modelValue
            }, function (e, t) {
                t != e && (angular.isDefined(p.$modelValue) && (p.$modelValue = null), h.refreshComponent())
            }), p.$render = function () {
                if (!angular.isArray(p.$viewValue)) {
                    if (!angular.isUndefined(p.$viewValue) && null !== p.$viewValue)throw t("multiarr", "Expected model value to be array but got '{0}'", p.$viewValue);
                    d.selected = []
                }
                d.selected = p.$viewValue, h.refreshComponent(), c.$evalAsync()
            }, c.$on("uis:select", function (e, t) {
                d.selected.length >= d.limit || (d.selected.push(t), h.updateModel())
            }), c.$on("uis:activate", function () {
                h.activeMatchIndex = -1
            }), c.$watch("$select.disabled", function (e, t) {
                t && !e && d.sizeSearchInput()
            }), d.searchInput.on("keydown", function (t) {
                var i = t.which;
                c.$apply(function () {
                    var c = !1;
                    e.isHorizontalMovement(i) && (c = r(i)), c && i != e.TAB && (t.preventDefault(), t.stopPropagation())
                })
            }), d.searchInput.on("keyup", function (t) {
                if (e.isVerticalMovement(t.which) || c.$evalAsync(function () {
                    d.activeIndex = d.taggingLabel === !1 ? -1 : 0
                }), d.tagging.isActivated && d.search.length > 0) {
                    if (t.which === e.TAB || e.isControl(t) || e.isFunctionKey(t) || t.which === e.ESC || e.isVerticalMovement(t.which))return;
                    if (d.activeIndex = d.taggingLabel === !1 ? -1 : 0, d.taggingLabel === !1)return;
                    var i, s, l, n, a = angular.copy(d.items), r = angular.copy(d.items), p = !1, h = -1;
                    if (void 0 !== d.tagging.fct) {
                        if (l = d.$filter("filter")(a, {isTag: !0}), l.length > 0 && (n = l[0]), a.length > 0 && n && (p = !0, a = a.slice(1, a.length), r = r.slice(1, r.length)), i = d.tagging.fct(d.search), r.some(function (e) {
                            return angular.equals(e, i)
                        }) || d.selected.some(function (e) {
                            return angular.equals(e, i)
                        }))return void c.$evalAsync(function () {
                            d.activeIndex = 0, d.items = a
                        });
                        i && (i.isTag = !0)
                    } else {
                        if (l = d.$filter("filter")(a, function (e) {
                            return e.match(d.taggingLabel)
                        }), l.length > 0 && (n = l[0]), s = a[0], void 0 !== s && a.length > 0 && n && (p = !0, a = a.slice(1, a.length), r = r.slice(1, r.length)), i = d.search + " " + d.taggingLabel, u(d.selected, d.search) > -1)return;
                        if (o(r.concat(d.selected)))return void(p && (a = r, c.$evalAsync(function () {
                            d.activeIndex = 0, d.items = a
                        })));
                        if (o(r))return void(p && (d.items = r.slice(1, r.length)))
                    }
                    p && (h = u(d.selected, i)), h > -1 ? a = a.slice(h + 1, a.length - 1) : (a = [], i && a.push(i), a = a.concat(r)), c.$evalAsync(function () {
                        if (d.activeIndex = 0, d.items = a, d.isGrouped) {
                            var e = i ? a.slice(1) : a;
                            d.setItemsFn(e), i && (d.items.unshift(i), d.groups.unshift({name: "", items: [i], tagging: !0}))
                        }
                    })
                }
            }), d.searchInput.on("blur", function () {
                i(function () {
                    h.activeMatchIndex = -1
                })
            })
        }}
    }]), i.directive("uiSelectNoChoice", ["uiSelectConfig", function (e) {
        return{restrict: "EA", require: "^uiSelect", replace: !0, transclude: !0, templateUrl: function (t) {
            t.addClass("ui-select-no-choice");
            var i = t.parent().attr("theme") || e.theme;
            return i + "/no-choice.tpl.html"
        }}
    }]), i.directive("uiSelectSingle", ["$timeout", "$compile", function (t, i) {
        return{restrict: "EA", require: ["^uiSelect", "^ngModel"], link: function (c, s, l, n) {
            var a = n[0], r = n[1];
            r.$parsers.unshift(function (e) {
                var t, i = {};
                return i[a.parserResult.itemName] = e, t = a.parserResult.modelMapper(c, i)
            }), r.$formatters.unshift(function (e) {
                var t, i = a.parserResult && a.parserResult.source(c, {$select: {search: ""}}), s = {};
                if (i) {
                    var l = function (i) {
                        return s[a.parserResult.itemName] = i, t = a.parserResult.modelMapper(c, s), t === e
                    };
                    if (a.selected && l(a.selected))return a.selected;
                    for (var n = i.length - 1; n >= 0; n--)if (l(i[n]))return i[n]
                }
                return e
            }), c.$watch("$select.selected", function (e) {
                r.$viewValue !== e && r.$setViewValue(e)
            }), r.$render = function () {
                a.selected = r.$viewValue
            }, c.$on("uis:select", function (e, t) {
                a.selected = t
            }), c.$on("uis:close", function (e, i) {
                t(function () {
                    a.focusser.prop("disabled", !1), i || a.focusser[0].focus()
                }, 0, !1)
            }), c.$on("uis:activate", function () {
                o.prop("disabled", !0)
            });
            var o = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' id='{{ $select.focusserId }}' aria-label='{{ $select.focusserTitle }}' aria-haspopup='true' role='button' />");
            i(o)(c), a.focusser = o, a.focusInput = o, s.parent().append(o), o.bind("focus", function () {
                c.$evalAsync(function () {
                    a.focus = !0
                })
            }), o.bind("blur", function () {
                c.$evalAsync(function () {
                    a.focus = !1
                })
            }), o.bind("keydown", function (t) {
                return t.which === e.BACKSPACE ? (t.preventDefault(), t.stopPropagation(), a.select(void 0), void c.$apply()) : void(t.which === e.TAB || e.isControl(t) || e.isFunctionKey(t) || t.which === e.ESC || (t.which != e.DOWN && t.which != e.UP && t.which != e.ENTER && t.which != e.SPACE || (t.preventDefault(), t.stopPropagation(), a.activate()), c.$digest()))
            }), o.bind("keyup input", function (t) {
                t.which === e.TAB || e.isControl(t) || e.isFunctionKey(t) || t.which === e.ESC || t.which == e.ENTER || t.which === e.BACKSPACE || (a.activate(o.val()), o.val(""), c.$digest())
            })
        }}
    }]), i.directive("uiSelectSort", ["$timeout", "uiSelectConfig", "uiSelectMinErr", function (e, t, i) {
        return{require: ["^^uiSelect", "^ngModel"], link: function (t, c, s, l) {
            if (null === t[s.uiSelectSort])throw i("sort", "Expected a list to sort");
            var n = l[0], a = l[1], r = angular.extend({axis: "horizontal"}, t.$eval(s.uiSelectSortOptions)), o = r.axis, u = "dragging", d = "dropping", p = "dropping-before", h = "dropping-after";
            t.$watch(function () {
                return n.sortable
            }, function (e) {
                e ? c.attr("draggable", !0) : c.removeAttr("draggable")
            }), c.on("dragstart", function (e) {
                c.addClass(u), (e.dataTransfer || e.originalEvent.dataTransfer).setData("text", t.$index.toString())
            }), c.on("dragend", function () {
                v(u)
            });
            var g, f = function (e, t) {
                this.splice(t, 0, this.splice(e, 1)[0])
            }, v = function (e) {
                angular.forEach(n.$element.querySelectorAll("." + e), function (t) {
                    angular.element(t).removeClass(e)
                })
            }, m = function (e) {
                e.preventDefault();
                var t = "vertical" === o ? e.offsetY || e.layerY || (e.originalEvent ? e.originalEvent.offsetY : 0) : e.offsetX || e.layerX || (e.originalEvent ? e.originalEvent.offsetX : 0);
                t < this["vertical" === o ? "offsetHeight" : "offsetWidth"] / 2 ? (v(h), c.addClass(p)) : (v(p), c.addClass(h))
            }, $ = function (t) {
                t.preventDefault();
                var i = parseInt((t.dataTransfer || t.originalEvent.dataTransfer).getData("text"), 10);
                e.cancel(g), g = e(function () {
                    b(i)
                }, 20)
            }, b = function (e) {
                var i = t.$eval(s.uiSelectSort), l = i[e], n = null;
                n = c.hasClass(p) ? e < t.$index ? t.$index - 1 : t.$index : e < t.$index ? t.$index : t.$index + 1, f.apply(i, [e, n]), a.$setViewValue(Date.now()), t.$apply(function () {
                    t.$emit("uiSelectSort:change", {array: i, item: l, from: e, to: n})
                }), v(d), v(p), v(h), c.off("drop", $)
            };
            c.on("dragenter", function () {
                c.hasClass(u) || (c.addClass(d), c.on("dragover", m), c.on("drop", $))
            }), c.on("dragleave", function (e) {
                e.target == c && (v(d), v(p), v(h), c.off("dragover", m), c.off("drop", $))
            })
        }}
    }]), i.factory("$$uisDebounce", ["$timeout", function (e) {
        return function (t, i) {
            var c;
            return function () {
                var s = this, l = Array.prototype.slice.call(arguments);
                c && e.cancel(c), c = e(function () {
                    t.apply(s, l)
                }, i)
            }
        }
    }]), i.service("uisRepeatParser", ["uiSelectMinErr", "$parse", function (e, t) {
        var i = this;
        i.parse = function (i) {
            var c;
            if (c = i.match(/^\s*(?:([\s\S]+?)\s+as\s+)?(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(\s*[\s\S]+?)?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/), !c)throw e("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", i);
            var s = c[5], l = "";
            if (c[3]) {
                s = c[5].replace(/(^\()|(\)$)/g, "");
                var n = c[5].match(/^\s*(?:[\s\S]+?)(?:[^\|]|\|\|)+([\s\S]*)\s*$/);
                n && n[1].trim() && (l = n[1], s = s.replace(l, ""))
            }
            return{itemName: c[4] || c[2], keyName: c[3], source: t(s), filters: l, trackByExp: c[6], modelMapper: t(c[1] || c[4] || c[2]), repeatExpression: function (e) {
                var t = this.itemName + " in " + (e ? "$group.items" : "$select.items");
                return this.trackByExp && (t += " track by " + this.trackByExp), t
            }}
        }, i.getGroupNgRepeatExpression = function () {
            return"$group in $select.groups"
        }
    }])
}(), angular.module("ui.select").run(["$templateCache", function (e) {
    e.put("bootstrap/choices.tpl.html", '<ul class="ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu" role="listbox" ng-show="$select.open && $select.items.length > 0"><li class="ui-select-choices-group" id="ui-select-choices-{{ $select.generatedId }}"><div class="divider" ng-show="$select.isGrouped && $index > 0"></div><div ng-show="$select.isGrouped" class="ui-select-choices-group-label dropdown-header" ng-bind="$group.name"></div><div ng-attr-id="ui-select-choices-row-{{ $select.generatedId }}-{{$index}}" class="ui-select-choices-row" ng-class="{active: $select.isActive(this), disabled: $select.isDisabled(this)}" role="option"><a href="" class="ui-select-choices-row-inner"></a></div></li></ul>'), e.put("bootstrap/match-multiple.tpl.html", '<span class="ui-select-match"><span ng-repeat="$item in $select.selected"><span class="ui-select-match-item btn btn-default btn-xs" tabindex="-1" type="button" ng-disabled="$select.disabled" ng-click="$selectMultiple.activeMatchIndex = $index;" ng-class="{\'btn-primary\':$selectMultiple.activeMatchIndex === $index, \'select-locked\':$select.isLocked(this, $index)}" ui-select-sort="$select.selected"><span class="close ui-select-match-close" ng-hide="$select.disabled" ng-click="$selectMultiple.removeChoice($index)">&nbsp;&times;</span> <span uis-transclude-append=""></span></span></span></span>'),
        e.put("bootstrap/match.tpl.html", '<div class="ui-select-match" ng-hide="$select.open && $select.searchEnabled" ng-disabled="$select.disabled" ng-class="{\'btn-default-focus\':$select.focus}"><span tabindex="-1" class="btn btn-default form-control ui-select-toggle" aria-label="{{ $select.baseTitle }} activate" ng-disabled="$select.disabled" ng-click="$select.activate()" style="outline: 0;"><span ng-show="$select.isEmpty()" class="ui-select-placeholder text-muted">{{$select.placeholder}}</span> <span ng-hide="$select.isEmpty()" class="ui-select-match-text pull-left" ng-class="{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}" ng-transclude=""></span> <i class="caret pull-right" ng-click="$select.toggle($event)"></i> <a ng-show="$select.allowClear && !$select.isEmpty() && ($select.disabled !== true)" aria-label="{{ $select.baseTitle }} clear" style="margin-right: 10px" ng-click="$select.clear($event)" class="btn btn-xs btn-link pull-right"><i class="glyphicon glyphicon-remove" aria-hidden="true"></i></a></span></div>'), e.put("bootstrap/no-choice.tpl.html", '<ul class="ui-select-no-choice dropdown-menu" ng-show="$select.items.length == 0"><li ng-transclude=""></li></ul>'), e.put("bootstrap/select-multiple.tpl.html", '<div class="ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control" ng-class="{open: $select.open}"><div><div class="ui-select-match"></div><input type="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="ui-select-search input-xs" placeholder="{{$selectMultiple.getPlaceholder()}}" ng-disabled="$select.disabled" ng-hide="$select.disabled" ng-click="$select.activate()" ng-model="$select.search" role="combobox" aria-label="{{ $select.baseTitle }}" ondrop="return false;"></div><div class="ui-select-choices"></div><div class="ui-select-no-choice"></div></div>'), e.put("bootstrap/select.tpl.html", '<div class="ui-select-container ui-select-bootstrap dropdown" ng-class="{open: $select.open}"><div class="ui-select-match"></div><input type="search" autocomplete="off" tabindex="-1" aria-expanded="true" aria-label="{{ $select.baseTitle }}" aria-owns="ui-select-choices-{{ $select.generatedId }}" aria-activedescendant="ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}" class="form-control ui-select-search" placeholder="{{$select.placeholder}}" ng-model="$select.search" ng-show="$select.searchEnabled && $select.open"><div class="ui-select-choices"></div><div class="ui-select-no-choice"></div></div>'), e.put("select2/choices.tpl.html", '<ul tabindex="-1" class="ui-select-choices ui-select-choices-content select2-results"><li class="ui-select-choices-group" ng-class="{\'select2-result-with-children\': $select.choiceGrouped($group) }"><div ng-show="$select.choiceGrouped($group)" class="ui-select-choices-group-label select2-result-label" ng-bind="$group.name"></div><ul role="listbox" id="ui-select-choices-{{ $select.generatedId }}" ng-class="{\'select2-result-sub\': $select.choiceGrouped($group), \'select2-result-single\': !$select.choiceGrouped($group) }"><li role="option" ng-attr-id="ui-select-choices-row-{{ $select.generatedId }}-{{$index}}" class="ui-select-choices-row" ng-class="{\'select2-highlighted\': $select.isActive(this), \'select2-disabled\': $select.isDisabled(this)}"><div class="select2-result-label ui-select-choices-row-inner"></div></li></ul></li></ul>'), e.put("select2/match-multiple.tpl.html", '<span class="ui-select-match"><li class="ui-select-match-item select2-search-choice" ng-repeat="$item in $select.selected" ng-class="{\'select2-search-choice-focus\':$selectMultiple.activeMatchIndex === $index, \'select2-locked\':$select.isLocked(this, $index)}" ui-select-sort="$select.selected"><span uis-transclude-append=""></span> <a href="javascript:;" class="ui-select-match-close select2-search-choice-close" ng-click="$selectMultiple.removeChoice($index)" tabindex="-1"></a></li></span>'), e.put("select2/match.tpl.html", '<a class="select2-choice ui-select-match" ng-class="{\'select2-default\': $select.isEmpty()}" ng-click="$select.toggle($event)" aria-label="{{ $select.baseTitle }} select"><span ng-show="$select.isEmpty()" class="select2-chosen">{{$select.placeholder}}</span> <span ng-hide="$select.isEmpty()" class="select2-chosen" ng-transclude=""></span> <abbr ng-if="$select.allowClear && !$select.isEmpty()" class="select2-search-choice-close" ng-click="$select.clear($event)"></abbr> <span class="select2-arrow ui-select-toggle"><b></b></span></a>'), e.put("select2/select-multiple.tpl.html", '<div class="ui-select-container ui-select-multiple select2 select2-container select2-container-multi" ng-class="{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled}"><ul class="select2-choices"><span class="ui-select-match"></span><li class="select2-search-field"><input type="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="combobox" aria-expanded="true" aria-owns="ui-select-choices-{{ $select.generatedId }}" aria-label="{{ $select.baseTitle }}" aria-activedescendant="ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}" class="select2-input ui-select-search" placeholder="{{$selectMultiple.getPlaceholder()}}" ng-disabled="$select.disabled" ng-hide="$select.disabled" ng-model="$select.search" ng-click="$select.activate()" style="width: 34px;" ondrop="return false;"></li></ul><div class="ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active" ng-class="{\'select2-display-none\': !$select.open || $select.items.length === 0}"><div class="ui-select-choices"></div></div></div>'), e.put("select2/select.tpl.html", '<div class="ui-select-container select2 select2-container" ng-class="{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled, \'select2-container-active\': $select.focus, \'select2-allowclear\': $select.allowClear && !$select.isEmpty()}"><div class="ui-select-match"></div><div class="ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active" ng-class="{\'select2-display-none\': !$select.open}"><div class="select2-search" ng-show="$select.searchEnabled"><input type="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="combobox" aria-expanded="true" aria-owns="ui-select-choices-{{ $select.generatedId }}" aria-label="{{ $select.baseTitle }}" aria-activedescendant="ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}" class="ui-select-search select2-input" ng-model="$select.search"></div><div class="ui-select-choices"></div></div></div>'), e.put("selectize/choices.tpl.html", '<div ng-show="$select.open" class="ui-select-choices ui-select-dropdown selectize-dropdown single"><div class="ui-select-choices-content selectize-dropdown-content"><div class="ui-select-choices-group optgroup" role="listbox"><div ng-show="$select.isGrouped" class="ui-select-choices-group-label optgroup-header" ng-bind="$group.name"></div><div role="option" class="ui-select-choices-row" ng-class="{active: $select.isActive(this), disabled: $select.isDisabled(this)}"><div class="option ui-select-choices-row-inner" data-selectable=""></div></div></div></div></div>'), e.put("selectize/match.tpl.html", '<div ng-hide="$select.searchEnabled && ($select.open || $select.isEmpty())" class="ui-select-match" ng-transclude=""></div>'), e.put("selectize/select.tpl.html", '<div class="ui-select-container selectize-control single" ng-class="{\'open\': $select.open}"><div class="selectize-input" ng-class="{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}" ng-click="$select.open && !$select.searchEnabled ? $select.toggle($event) : $select.activate()"><div class="ui-select-match"></div><input type="search" autocomplete="off" tabindex="-1" class="ui-select-search ui-select-toggle" ng-click="$select.toggle($event)" placeholder="{{$select.placeholder}}" ng-model="$select.search" ng-hide="!$select.searchEnabled || ($select.selected && !$select.open)" ng-disabled="$select.disabled" aria-label="{{ $select.baseTitle }}"></div><div class="ui-select-choices"></div></div>')
}]);
//# sourceMappingURL=select.min.js.map