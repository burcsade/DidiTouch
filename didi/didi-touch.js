/**
 * didiTouch Javascript Library
 * (c) 2011 Burc Sade, http://burcsade.com/
 *
 * didiTouch is released under the MIT license.
 *
 * didiTouch is an extension to Sencha Touch javascript framework provided by
 * Sencha Inc. Components found in this library are generally based on or inspired
 * by components in Sencha Touch library and are meant to be a guide to people
 * learning how to put things to work with Sencha Touch. If you find it useful
 * and/or have questions you can drop me an email.
 *
 * burcsade(at)gmail(dot)com
 *
 */

Ext.ns('dtLib', 'dtLib.fields', 'dtLib.lists', 'dtLib.plugins', 'dtLib.util');


/*
 * PlainField
 *
 * Provides a form field with just a label on the left and plain text on the
 * right. It is not meant to be used for collecting data but only for display
 * purposes of key/value data.
 *
 */

dtLib.fields.PlainField = Ext.extend(Ext.form.Field, {
    renderTpl: [
        '<tpl if="label"><div class="x-form-label"><span>{label}</span></div></tpl>',
        '<div class="x-form-field-container" style="float:left; background-color:#fff; padding:10px;">',
            '<div class="x-form-field-text"><span class="{fieldCls}"></span></div>',
        '</div>'
    ],
    initRenderData: function() {
        dtLib.fields.PlainField.superclass.initRenderData.apply(this, arguments);

        Ext.applyIf(this.renderData, {
            label   :   this.label
        });

        return this.renderData;
    },
    getValue: function(){
        if (!this.rendered || !this.fieldEl) {
            return this.value;
        }

        return this.fieldEl.getHTML();
    },
    setValue: function(value){
        this.value = value;

        if (this.rendered && this.fieldEl) {
            this.fieldEl.dom.innerHTML = (Ext.isEmpty(value) ? '' : value);
        }

        return this;
    }
});

Ext.reg('dtPlainField', dtLib.fields.PlainField);


/*
 * ImageField
 * 
 * Provides a form field to display an image. Image update code can be 
 * placed in the handler of this component to let the user change the image.
 * 
 */

dtLib.fields.ImageField = Ext.extend(Ext.form.Field, {
    inputType: 'image',
    renderTpl: [
        '<tpl if="label"><div class="x-form-label"><span>{label}</span></div></tpl>',
        '<div class="x-form-field-container" style="float:left; background-color:#fff; padding:10px;">',
            '<div class="x-form-field-image"><img class="{fieldCls}" src="{value}"/></div>',
        '</div>'
    ],
    initRenderData: function() {
        dtLib.fields.ImageField.superclass.initRenderData.apply(this, arguments);

        Ext.applyIf(this.renderData, {
            label   :   this.label
        });

        return this.renderData;
    },
    initEvents : function() {
        var me = this;

        dtLib.fields.ImageField.superclass.initEvents.call(me);

        me.mon(me.fieldEl, {
            scope       : me,
            tap         : me.onPress,
            tapstart    : me.onTapStart,
            tapcancel   : me.onTapCancel
        });
    },
    onPress : function(e) {
        var me = this;
        if (!me.disabled) {
            setTimeout(function() {
                me.onTapCancel();
                me.callHandler(e);
                me.fireEvent('tap', me, e);
            }, 10);
        }
    },
    onTapStart : function() {
        var me = this;
        if (!me.disabled) {
            me.fieldEl.addCls(me.pressedCls);
        }
    },
    onTapCancel : function() {
        var me = this;
        me.fieldEl.removeCls(me.pressedCls);
    },
    callHandler: function(e) {
        var me = this;
        if (me.handler) {
            me.handler.call(me.scope || me, me, e);
        }
    },
    getValue: function(){
        if (!this.rendered || !this.fieldEl) {
            return this.value;
        }

        return this.fieldEl.dom.src;
    },
    setValue: function(value){
        this.value = value;

        if (this.rendered && this.fieldEl) {
            this.fieldEl.dom.src = (Ext.isEmpty(value) ? '' : value);
        }

        return this;
    }
});

Ext.reg('dtImageField', dtLib.fields.ImageField);


/*
 * ButtonField
 *
 * Provides a form field with an image (if defined) and label on the left which
 * is clickable. Field text is shown on the right with an arrow (if set). This
 * component is mainly useful for displaying numerical data with details listed
 * when clicked.
 *
 */

dtLib.fields.ButtonField = Ext.extend(dtLib.fields.PlainField, {
    disabled: false,
    arrow: true,
    pressedCls: 'dt-buttonField-pressed',
    renderTpl: [
        '<div class="x-form-field-container" style="float:left; background-color:#fff; padding:10px;">',
            '<tpl if="image != undefined"><div style="float:left; padding-right:10px;"><img src="{image}" class="x-form-button-image"></div></tpl>',
            '<div class="x-form-field-text" style="float:left; vertical-align:middle;">{label}</div>',
            '<tpl if="arrow"><div style="float:right; color:#555;" class="x-form-field-text">></div></tpl>',
            '<div class="x-form-field-text" style="float:right; margin: 5px 10px 0px; font-size:80%; color:#999;">',
                '<span class="{fieldCls}"></span>',
            '</div>',
        '</div>'
    ],
    applyRenderSelectors: function() {
        this.renderSelectors = Ext.applyIf(this.renderSelectors || {}, {
            imageEl: '.x-form-button-image'
        });

        dtLib.fields.ButtonField.superclass.applyRenderSelectors.call(this);
    },
    initComponent: function(){
        this.addEvents(
            'tap'
        );

        dtLib.fields.ButtonField.superclass.initComponent.call(this);
    },
    initEvents : function() {
        var me = this;

        dtLib.fields.ButtonField.superclass.initEvents.call(me);

        me.mon(me.el, {
            scope       : me,
            tap         : me.onPress,
            tapstart    : me.onTapStart,
            tapcancel   : me.onTapCancel
        });
    },
    initRenderData: function() {
        dtLib.fields.ButtonField.superclass.initRenderData.apply(this, arguments);

        Ext.applyIf(this.renderData, {
            label   :   this.label,
            arrow   :   this.arrow,
            image   :   this.image
        });

        return this.renderData;
    },
    onPress : function(e) {
        var me = this;
        if (!me.disabled) {
            setTimeout(function() {
                me.onTapCancel();
                me.callHandler(e);
                me.fireEvent('tap', me, e);
            }, 10);
        }
    },
    onTapStart : function() {
        var me = this;
        if (!me.disabled) {
            me.el.select('div.x-form-field-container').addCls(me.pressedCls);
        }
    },
    onTapCancel : function() {
        var me = this;
        me.el.select('div.x-form-field-container').removeCls(me.pressedCls);
    },
    callHandler: function(e) {
        var me = this;
        if (me.handler) {
            me.handler.call(me.scope || me, me, e);
        }
    },
    setImage: function(image) {
        this.image = image;

        if (this.rendered && this.imageEl) {
            this.imageEl.dom.src = (Ext.isEmpty(image) ? '' : image);
        }

        return this;
    }
});

Ext.reg('dtButtonField', dtLib.fields.ButtonField);

/* 
 * RecipientField
 * 
 * Provides a text field with a select button on the right to let the user to 
 * select the data to put in the field. Useful for letting users select 
 * recipients when composing a message. 
 * 
 * recipienttap event should be handled to present a list of options to user.
 *
 */

dtLib.fields.RecipientField = Ext.extend(Ext.form.TextField, {
    fieldCls: 'x-form-field',
    baseCls: 'x-field',
    renderTpl: [
        '<tpl if="label">',
            '<div class="x-form-label"><span>{label}</span></div>',
        '</tpl>',
        '<tpl if="fieldEl">',
            '<div class="x-form-field-container">',
                '<input id="{inputId}" type="{inputType}" name="{name}" class="{fieldCls}"',
                '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
                '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
                '<tpl if="style">style="{style}" </tpl>',
                '<tpl if="maxlength">maxlength="{maxlength}" </tpl>',
                '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
                '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
                '<tpl if="autoCorrect">autocorrect="{autoCorrect}" </tpl> />',
            '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
            '</div>',
            '<div class="x-field-recipient">+</div>',
            '<tpl if="useClearIcon"><div class="x-field-clear-container"><div class="x-field-clear x-hidden-visibility">&#215;</div></div></tpl>',
        '</tpl>'
    ],
    initRenderData: function() {
        dtLib.fields.RecipientField.superclass.initRenderData.apply(this, arguments);

        Ext.applyIf(this.renderData, {
            label           :   this.label
        });

        return this.renderData;
    },
    applyRenderSelectors: function() {
        this.renderSelectors = Ext.applyIf(this.renderSelectors || {}, {
            recipientEl: '.x-field-recipient'
        });

        dtLib.fields.RecipientField.superclass.applyRenderSelectors.call(this);
    },
    initEvents: function() {
        dtLib.fields.RecipientField.superclass.initEvents.call(this);

        if (this.fieldEl) {
            if (this.recipientEl){
                this.mon(this.recipientEl, {
                    scope: this,
                    tap: this.onRecipientIconTap
                });
            }
        }
    },
    onRecipientIconTap: function() {
        this.fireEvent('recipienttap', this);
    }
});

Ext.reg('dtRecipientField', dtLib.fields.RecipientField);


/*
 * CenteredButtonField
 *
 * Provides a clickable button field with text centered.
 *
 */

dtLib.fields.CenteredButtonField = Ext.extend(dtLib.fields.ButtonField, {
    renderTpl: [
        '<div class="x-form-field-container" style="float:left; background-color:#fff; padding:10px; text-align:center;">',
            '<div class="x-form-field-text">{label}</div>',
        '</div>'
    ]
});

Ext.reg('dtCenteredButtonField', dtLib.fields.CenteredButtonField);


/*
 * ListPagingPlugin
 *
 * Based on Sencha Touch ListPagingPlugin, this component makes it possible to
 * list data which is retrieved from a key/value database like Cassandra.
 *
 * Based on total value returned from proxy reads and the number of data added
 * to the store of the list, it hides and disabled the plugin when no more data
 * is to be read.
 *
 * lastitem parameter in the proxy call should be used to decide where to start
 * reading on database. direction parameter is used to tell the direction of the
 * read operation on server side and can be disregarded if data is always read
 * in one direction.
 *
 */

dtLib.plugins.ListPagingPlugin = Ext.extend(Ext.util.Observable, {
    prevRecordCount: -1,
    sortField: 'id',
    autoPaging: false,
    loadMoreText: 'Load More...',
    init: function(list) {
        this.prevRecordCount = -1;  // reset value on init
        this.list = list;
        
        list.onBeforeLoad = Ext.util.Functions.createInterceptor(list.onBeforeLoad, this.onBeforeLoad, this);
        this.mon(this.list, 'update', this.onListUpdate, this);
    },
    onListUpdate : function() {
        var store = this.list.store,
            reader = store.proxy.reader,
            totalRecords = (reader.rawData) ? reader.getTotal(reader.rawData) : -1;

        if (!this.rendered)
            this.render();
        
        this.el.appendTo(this.list.getTargetEl());

        if (this.autoPaging) {
            this.mon(this.list.getTargetEl().getScrollParent(), 'scrollend', this.onScrollEnd, this);
        } else {
            this.el.removeCls('x-loading');
            this.mon(this.el, 'tap', this.onPagingTap, this);
        }

        if (this.el) {
            if (totalRecords == store.data.length // loaded all data
                || this.prevRecordCount == store.data.length)  // no new data
                this.el.hide();
        } else {
            this.el.removeCls('x-loading');
            this.el.show();
        }

        this.loading = false;
    },
    render : function() {
        var list = this.list,
            targetEl = list.getTargetEl(),
            html = '';

        if (!this.autoPaging) {
            html += '<div class="x-list-paging-msg">' + this.loadMoreText + '</div>';
        }

        this.el = targetEl.createChild({
            cls: 'x-list-paging' + (this.autoPaging ? ' x-loading' : ''),
            html: html + Ext.LoadingSpinner
        });

        this.rendered = true;
    },
    onBeforeLoad : function() {
        var store = this.list.store;

        this.prevRecordCount = store.data.length; // actual shown data count

        var lastItem = store.last();

        // set lastitem parameter
        Ext.apply(store.proxy.extraParams, {
            lastitem: (lastItem) ? lastItem.get(this.sortField) : '',
            itemcount: this.list.store.data.length,
            direction: 0
        });

        if (this.loading && store.getCount() > 0 && this.list.loadMask != undefined) {
            this.list.loadMask.disable();
            return false;
        }
    },
    onPagingTap : function(e) {
        if (!this.loading) {
            this.loading = true;
            this.list.store.nextPage();
            this.el.addCls('x-loading');
        }
    },
    onScrollEnd : function(scroller, pos) {
        if (pos.y >= Math.abs(scroller.offsetBoundary.top)) {
            this.loading = true;
            this.list.store.nextPage();
            this.el.addCls('x-loading');
        }
    }
});





// ************************************************

dtLib.util.ago = function(date, baseDate, granularity) {
    if(granularity == undefined) granularity = 1;
    if(baseDate == undefined) baseDate = new Date().getTime();

    var periods = [],
        output = '',
        difference = Math.abs(date - baseDate),
        time, ext, value;

    periods['yr'] = 31536000;
    periods['mt'] = 2592000;
    periods['wk'] = 604800;
    periods['dy'] = 86400;
    periods['hr'] = 3600;
    periods['mn'] = 60;
    periods['se'] = 1;

    for (var period in periods) {
        value = periods[period];

        if(difference >= value) {
            time = Math.floor(difference / value);
            difference %= value;

            //ext = (time > 1) ? 's ' : ' ';
            output = output + time + ' ' + period; // + ext;

            if(granularity-- == 1) break;
        }
    }

    return output;// + ' ago';
}


dtLib.util.formatCount = function(count) {
    // TODO do & move to lib
    return count;
}

dtLib.util.rateClass = function (rating) {
   if (rating > 8)
       return 'rateUH';
   else if (rating > 5)
       return 'rateVH';
   else if (rating > 2)
       return 'rateH';
   else if (rating > 0)
       return 'rateM';
   else if (rating > -3)
       return 'rateL';
   else if (rating > -7)
       return 'rateVL';
   else
       return 'rateUL';
}

dtLib.util.formatRating = function (rating) {
    return (rating > 0) ? '+' + rating : rating;
}




