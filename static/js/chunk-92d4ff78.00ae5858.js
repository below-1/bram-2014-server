(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-92d4ff78"],{2677:function(t,a,e){"use strict";e.d(a,"a",function(){return l});var n=e("8654"),i=e("a844"),o=e("7cf7"),s=e("ab6d"),r=e("d9bd"),l={functional:!0,$_wrapperFor:n["a"],props:{textarea:Boolean,multiLine:Boolean},render:function(t,a){var e=a.props,u=a.data,c=a.slots,d=a.parent;Object(s["a"])(u);var h=Object(o["a"])(c(),t);return e.textarea&&Object(r["d"])("<v-text-field textarea>","<v-textarea outline>",l,d),e.multiLine&&Object(r["d"])("<v-text-field multi-line>","<v-textarea>",l,d),e.textarea||e.multiLine?(u.attrs.outline=e.textarea,t(i["a"],u,h)):t(n["a"],u,h)}}},"7e63":function(t,a,e){},a595:function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("v-toolbar",{attrs:{flat:""}},[e("v-toolbar-title",[t._v("Pengaturan")]),e("v-spacer"),e("v-btn",{attrs:{dark:"",depressed:"",color:"cyan"},on:{click:t.saveSettings}},[t._v("Simpan")])],1),e("v-container",{attrs:{fluid:""}},[e("v-layout",{attrs:{row:""}},[e("v-flex",{attrs:{md6:""}},[e("v-card",{attrs:{flat:""}},[e("v-card-title",[t._v("\n            Umum\n          ")]),e("v-card-text",[e("v-text-field",{attrs:{label:"Nama"},model:{value:t.data.mainName,callback:function(a){t.$set(t.data,"mainName",a)},expression:"data.mainName"}}),e("v-text-field",{attrs:{label:"Nama Singkat"},model:{value:t.data.secondaryName,callback:function(a){t.$set(t.data,"secondaryName",a)},expression:"data.secondaryName"}}),e("v-textarea",{attrs:{label:"Deskripsi Lengkap"},model:{value:t.data.title,callback:function(a){t.$set(t.data,"title",a)},expression:"data.title"}}),e("v-text-field",{attrs:{label:"Deskripsi Singkat"},model:{value:t.data.subtitle,callback:function(a){t.$set(t.data,"subtitle",a)},expression:"data.subtitle"}})],1)],1)],1)],1)],1)],1)},i=[],o=e("ef41"),s={name:"Settings",data:function(){return{data:{mainName:"",secondaryName:"",title:"",subtitle:""}}},methods:{loadSettings:function(){var t={mainName:o["a"].getMainName(),secondaryName:o["a"].getSecondaryName(),title:o["a"].getTitle(),subtitle:o["a"].getSubtitle()};this.data=t},saveSettings:function(){o["a"].setMainName(this.data.mainName),o["a"].setSecondaryName(this.data.secondaryName),o["a"].setTitle(this.data.title),o["a"].setSubtitle(this.data.subtitle),this.loadSettings()}},mounted:function(){this.loadSettings()}},r=s,l=e("2877"),u=e("6544"),c=e.n(u),d=e("8336"),h=e("b0af"),p=e("99d9"),m=e("12b2"),f=e("a523"),v=e("0e8f"),b=e("a722"),g=e("9910"),x=e("2677"),w=e("a844"),N=e("71d9"),y=e("2a7f"),k=Object(l["a"])(r,n,i,!1,null,null,null);a["default"]=k.exports;c()(k,{VBtn:d["a"],VCard:h["a"],VCardText:p["b"],VCardTitle:m["a"],VContainer:f["a"],VFlex:v["a"],VLayout:b["a"],VSpacer:g["a"],VTextField:x["a"],VTextarea:w["a"],VToolbar:N["a"],VToolbarTitle:y["b"]})},a844:function(t,a,e){"use strict";e("7e63");var n=e("8654"),i=e("d9bd"),o=Object.assign||function(t){for(var a=1;a<arguments.length;a++){var e=arguments[a];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t};a["a"]={name:"v-textarea",extends:n["a"],props:{autoGrow:Boolean,noResize:Boolean,outline:Boolean,rowHeight:{type:[Number,String],default:24,validator:function(t){return!isNaN(parseFloat(t))}},rows:{type:[Number,String],default:5,validator:function(t){return!isNaN(parseInt(t,10))}}},computed:{classes:function(){return o({"v-textarea":!0,"v-textarea--auto-grow":this.autoGrow,"v-textarea--no-resize":this.noResizeHandle},n["a"].options.computed.classes.call(this,null))},dynamicHeight:function(){return this.autoGrow?this.inputHeight:"auto"},isEnclosed:function(){return this.textarea||n["a"].options.computed.isEnclosed.call(this)},noResizeHandle:function(){return this.noResize||this.autoGrow}},watch:{lazyValue:function(){!this.internalChange&&this.autoGrow&&this.$nextTick(this.calculateInputHeight)}},mounted:function(){var t=this;setTimeout(function(){t.autoGrow&&t.calculateInputHeight()},0),this.autoGrow&&this.noResize&&Object(i["b"])('"no-resize" is now implied when using "auto-grow", and can be removed',this)},methods:{calculateInputHeight:function(){var t=this.$refs.input;if(t){t.style.height=0;var a=t.scrollHeight,e=parseInt(this.rows,10)*parseFloat(this.rowHeight);t.style.height=Math.max(e,a)+"px"}},genInput:function(){var t=n["a"].options.methods.genInput.call(this);return t.tag="textarea",delete t.data.attrs.type,t.data.attrs.rows=this.rows,t},onInput:function(t){n["a"].options.methods.onInput.call(this,t),this.autoGrow&&this.calculateInputHeight()},onKeyDown:function(t){this.isFocused&&13===t.keyCode&&t.stopPropagation(),this.internalChange=!0,this.$emit("keydown",t)}}}}}]);
//# sourceMappingURL=chunk-92d4ff78.00ae5858.js.map