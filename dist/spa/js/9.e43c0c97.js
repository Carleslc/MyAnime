(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{7023:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t._self._c;return t.display?e("q-card",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"anime-episode",class:{small:t.isSmallElement,"on-hover":t.$q.platform.is.desktop}},[e("q-resize-observer",{attrs:{debounce:"200"},on:{resize:t.handleResize}}),e("dynamic-button",{staticClass:"column justify-between full-height",attrs:{href:t.episodeUrl,open:t.open,"aria-label":t.aria}},[e("q-img",{staticClass:"full-height",attrs:{src:t.anime.cover,basic:"","spinner-color":"primary"},on:{load:function(e){return t.$emit("loaded",t.anime.id)},error:function(e){return t.$emit("loaded",t.anime.id)}}}),e("div",{staticClass:"absolute-full hoverable overlay column justify-center"},[e("q-btn",{ref:"fabSettings",staticClass:"absolute-top-left q-ma-sm",attrs:{"fab-mini":"",icon:"settings",color:"white","text-color":"primary",tabindex:"0","aria-label":t.$t("settings")},on:{click:function(e){return e.preventDefault(),e.stopPropagation(),t.preventFocus("fabSettings")}}},[e("q-tooltip",{attrs:{"transition-show":"jump-right","transition-hide":"jump-left",anchor:"center right",self:"center left",offset:[10,10],"content-class":["text-primary","bg-white"]}},[t._v("\n          "+t._s(t.$t("settings"))+"\n        ")]),e("q-menu",{staticClass:"z-max",attrs:{offset:[0,5]}},[e("anime-settings",{attrs:{anime:t.anime}})],1)],1),e("q-btn",{ref:"fabNext",staticClass:"absolute-top-right q-ma-sm",attrs:{fab:!t.isSmallElement,"fab-mini":t.isSmallElement,"text-color":t.anime.isLastEpisode?"positive":"accent",icon:t.anime.isLastEpisode?"library_add_check":"queue_play_next",loading:t.updating,color:"white",tabindex:"0","aria-label":t.nextLabel},on:{click:function(e){return e.preventDefault(),e.stopPropagation(),t.nextEpisode.apply(null,arguments)}}},[t.anime.isLastEpisode?t._e():e("q-badge",{attrs:{color:"secondary",floating:""}},[t._v(t._s(t.anime.nextEpisode))]),e("q-tooltip",{attrs:{"transition-show":"jump-down","transition-hide":"jump-up",anchor:"bottom left",self:"top middle",offset:[10,8],"content-class":[t.anime.isLastEpisode?"text-positive":"text-secondary","bg-white"]}},[t._v(t._s(t.nextLabel)+"\n        ")])],1),e("h1",{staticClass:"col-auto full-width q-px-xs q-mt-auto q-pt-xl"},[t._v(t._s(t.title))]),e("div",{class:"column full-width q-pa-".concat(t.isSmallElement?"xs":"sm"," q-mt-auto")},[t.formattedAiringDate?e("div",{staticClass:"row justify-center full-width",class:"q-mb-".concat(t.isSmallElement?"sm":"md")},[e("h2",{staticClass:"full-width fit-text"},[e("q-icon",{staticClass:"q-mr-xs",attrs:{name:"schedule"}}),t._v(" "+t._s(t.formattedAiringDate))],1)]):t._e(),e("q-chip",{staticClass:"col-auto bg-white overflow-hidden",class:{"q-pb-xs":t.anime.totalEpisodes,"q-pa-none":t.isSmallElement,"q-pa-xs":!t.isSmallElement},attrs:{size:t.isSmallElement?"sm":"md","text-color":t.anime.isLastEpisode?"positive":"secondary"}},[e("div",{staticClass:"row justify-center full-width"},[t._v("\n            "+t._s(t.$t("episode"))+" "+t._s(t.anime.nextEpisode)+"\n            "),t.anime.totalEpisodes&&!t.isSmallElement?e("span",{staticClass:"q-pl-xs"},[t._v("/ "+t._s(t.anime.totalEpisodes))]):t._e()]),t.anime.totalEpisodes?e("q-linear-progress",{staticClass:"absolute-bottom",attrs:{value:t.anime.progress,color:t.anime.isLastEpisode?"positive":"secondary"}}):t._e()],1)],1)],1)],1)],1):t._e()},a=[],s=i("7ec2"),r=i.n(s),o=i("c973"),l=i.n(o),d=i("278c"),c=i.n(d),p=i("ded3"),m=i.n(p),u=(i("99af"),i("caad"),i("2532"),i("d3b7"),i("d81d"),i("4fad"),i("13d5"),i("e6cf"),i("a79d"),i("1315")),h=i("2f62"),f=i("4245"),g={props:{anime:{type:Object,required:!0}},data:function(){return{width:0,updating:!1}},computed:m()(m()(m()(m()({},Object(h["c"])("store",["providerByAnimeTitle","titleByAnimeId"])),Object(h["e"])("store",["typeFilter","airingStatusFilter","genreFilter"])),Object(h["e"])("store",{calendarEntry:function(t){return t.calendar[this.anime.title]}})),{},{provider:function(){return this.providerByAnimeTitle(this.title).value},title:function(){return this.titleByAnimeId(this.anime.id)||this.anime.title},nextLabel:function(){return this.$t(this.anime.isLastEpisode?"complete":"nextEpisode")},aria:function(){return"".concat(this.title," ").concat(this.$t("episode")," ").concat(this.anime.nextEpisode)},display:function(){var t=this;return!this.anime.isCompleted&&(this.typeFilter.includes(this.anime.type)||"unknown"===this.anime.type)&&(this.nextEpisodeIsAired&&this.airingStatusFilter.includes("already-aired")||!this.nextEpisodeIsAired&&this.airingStatusFilter.includes("not-yet-aired"))&&(0===this.genreFilter.length||this.genreFilter.every((function(e){return t.anime.genres.includes(e)})))},broadcast:function(){if(this.anime.broadcast&&this.anime.broadcast.weekday){var t=u["DateTime"].fromFormat("".concat(this.anime.broadcast.weekday," ").concat(this.anime.broadcast.time||"23:59"),"EEEE HH:mm",{zone:"Asia/Tokyo"}).toLocal();if(this.anime.airingDate){var e=this.anime.airingDate.startOf("week").plus({weeks:this.anime.nextEpisode-1,days:t.weekday-1,hours:t.hour+this.provider.offset,minutes:t.minute});return{date:e,precision:this.anime.airingDatePrecision}}return{date:t,precision:"day"}}return null},nextCalendarAiringEpisode:function(){if(this.calendarEntry){var t=Object.entries(this.calendarEntry).map((function(t){var e=c()(t,2),i=e[0],n=e[1];return[parseInt(i,10),u["DateTime"].fromISO(n)]})),e=t.reduce((function(t,e){return e[1]<t[1]?e:t}))[0];if(!this.anime.totalEpisodes||e<=this.anime.totalEpisodes)return e}return null},nextEpisodeCalendarAiringDate:function(){if(this.calendarEntry){var t=this.calendarEntry[this.anime.nextEpisode],e={hours:this.provider.offset};if(!t&&this.nextCalendarAiringEpisode&&this.anime.nextEpisode>this.nextCalendarAiringEpisode&&(t=this.calendarEntry[this.nextCalendarAiringEpisode],e.weeks=this.anime.nextEpisode-this.nextCalendarAiringEpisode),t)return{date:u["DateTime"].fromISO(t).toLocal().plus(e),precision:"day"}}return null},nextEpisodeAiringDate:function(){if("finished airing"!==this.anime.airingStatus){if(this.nextEpisodeCalendarAiringDate)return this.nextEpisodeCalendarAiringDate;if(this.broadcast)return this.broadcast;if("not yet aired"===this.anime.airingStatus&&this.anime.airingDate&&1===this.anime.nextEpisode)return{date:this.anime.airingDate.plus(0),precision:this.anime.airingDatePrecision}}return null},nextEpisodeIsAired:function(){return"finished airing"===this.anime.airingStatus||this.nextCalendarAiringEpisode&&this.anime.nextEpisode<this.nextCalendarAiringEpisode||this.anime.isAired&&this.nextEpisodeAiringDate&&this.nextEpisodeAiringDate.date<=u["DateTime"].local()},formattedAiringDate:function(){if(this.nextEpisodeIsAired)return null;if(!this.nextEpisodeAiringDate)return"?";var t=this.nextEpisodeAiringDate,e=t.date,i=t.precision,n=u["DateTime"].local(),a=Math.ceil(Math.abs(e.diff(n,"hours").toObject().hours));if(a<=24)return e.day===n.day?e.toRelative():e.toRelativeCalendar();if("day"===i){var s=e.weekdayLong,r=e.toLocaleString(this.isSmallElement?u["DateTime"].DATE_FULL:u["DateTime"].DATE_MED);return this.isSmallElement?r:"".concat(s," ").concat(r)}return"month"===i?e.toLocaleString({month:"long",year:"numeric"}):e.toLocaleString({year:"numeric"})},params:function(){return{anime:this.anime,title:this.title,episode:this.anime.nextEpisode}},episodeUrl:function(){return this.provider.episodeUrl(this.params)},open:function(){var t=this;return this.provider.open?l()(r()().mark((function e(){return r()().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.provider.open(t.params);case 3:e.next=8;break;case 5:e.prev=5,e.t0=e["catch"](0),Object(f["b"])(e.t0);case 8:case"end":return e.stop()}}),e,null,[[0,5]])}))):null},isSmallElement:function(){return this.width<185}}),mounted:function(){this.width=this.$el.offsetWidth,this.display||this.$emit("loaded",this.anime.id)},methods:m()(m()({},Object(h["b"])("store",["updateEpisode"])),{},{handleResize:function(t){t.width!==this.width&&(this.width=t.width)},nextEpisode:function(){var t=this;this.updating=!0;var e=this.anime.isLastEpisode,i=this.anime.status,n=this.$t.bind(this.$root);this.updateEpisode(this.anime).then((function(a){var s=a.ok;s&&(e?t.$q.notify({message:n("completed",{title:t.title}),color:"positive"}):(t.$q.notify({message:n("updated",{title:t.title,episode:t.anime.lastWatchedEpisode}),color:"primary"}),"watching"!==i&&t.$q.notify({message:n("statusChanged",{title:t.title,status:n("status.watching")}),type:"info",html:!0})))})).finally((function(){t.updating=!1})),this.preventFocus("fabNext")},preventFocus:function(t){this.$refs[t].$el.focus(),this.$refs[t].$el.blur()}})},E=g,b=i("2877"),v=i("f09f"),x=i("3980"),y=i("068f"),w=i("9c40"),q=i("05c0"),A=i("4e73"),C=i("58a81"),D=i("0016"),_=i("b047"),S=i("6b1d"),L=i("714f"),$=i("eebe"),k=i.n($),j=Object(b["a"])(E,n,a,!1,null,null,null);e["default"]=j.exports;k()(j,"components",{QCard:v["a"],QResizeObserver:x["a"],QImg:y["a"],QBtn:w["a"],QTooltip:q["a"],QMenu:A["a"],QBadge:C["a"],QIcon:D["a"],QChip:_["a"],QLinearProgress:S["a"]}),k()(j,"directives",{Ripple:L["a"]})}}]);