import{a as O,q as G,r as x,c as M,w as o,b as E,f as i,g as t,h as p,u as a,m as I,B as _,N as L,l as S,x as D,y as V,z as v,A as N,G as g,C as z,E as U,H as A,I as B,p as J,_ as P}from"./index-Buc8SEyh.js";import{P as H}from"./PageLayout-DTTcbtkn.js";import{T as R}from"./ToolsRightSidebar-DobkOqx8.js";import"./monaco-editor-D6KFlyNG.js";const W={class:"java-generator-container"},q={class:"flex items-center justify-between mb-6"},K={class:"mb-4"},Q={class:"grid grid-cols-1 md:grid-cols-2 gap-4"},X={class:"flex flex-wrap gap-3"},Y={class:"grid grid-cols-12 gap-2"},Z={class:"code-output"},ee={class:"mb-4"},ae={class:"flex justify-center items-center py-10"},te={class:"mb-4"},le={class:"flex justify-center items-center py-10"},se=O({__name:"JavaGenerator",setup(oe){const C=I(),b=G(),r=x({className:"User",packageName:"com.example.entity",useLombok:!0,generateGetterSetter:!0,generateToString:!0,generateBuilder:!1,fields:[{name:"id",type:"Long",accessLevel:"private",isFinal:!1},{name:"username",type:"String",accessLevel:"private",isFinal:!1},{name:"email",type:"String",accessLevel:"private",isFinal:!1},{name:"createTime",type:"LocalDateTime",accessLevel:"private",isFinal:!1}]}),j=[{label:"private",value:"private"},{label:"protected",value:"protected"},{label:"public",value:"public"}],w=[{label:"String",value:"String"},{label:"Integer",value:"Integer"},{label:"Long",value:"Long"},{label:"Boolean",value:"Boolean"},{label:"Double",value:"Double"},{label:"Float",value:"Float"},{label:"BigDecimal",value:"BigDecimal"},{label:"LocalDate",value:"LocalDate"},{label:"LocalDateTime",value:"LocalDateTime"},{label:"Date",value:"Date"},{label:"List<String>",value:"List<String>"},{label:"Map<String, Object>",value:"Map<String, Object>"}],k=x(`package com.example.entity;

import java.time.LocalDateTime;
import lombok.Data;

/**
 * User 实体类
 */
@Data
public class User {
    private Long id;
    private String username;
    private String email;
    private LocalDateTime createTime;
}`);function h(){const{className:m,packageName:e,useLombok:l,generateGetterSetter:u,generateToString:y,generateBuilder:T,fields:f}=r.value,d=new Set;f.forEach(s=>{s.type==="LocalDate"||s.type==="LocalDateTime"?d.add("java.time."+s.type):s.type==="Date"?d.add("java.util.Date"):s.type==="BigDecimal"?d.add("java.math.BigDecimal"):s.type.startsWith("List")?d.add("java.util.List"):s.type.startsWith("Map")&&d.add("java.util.Map")}),l&&(u?d.add("lombok.Data"):(u&&(d.add("lombok.Getter"),d.add("lombok.Setter")),y&&d.add("lombok.ToString")),T&&d.add("lombok.Builder"));let n=`package ${e};

`;const $=Array.from(d).sort();$.length>0&&($.forEach(s=>{n+=`import ${s};
`}),n+=`
`),n+=`/**
 * ${m} 实体类
 */
`,l&&(u?n+=`@Data
`:(u&&(n+=`@Getter
@Setter
`),y&&(n+=`@ToString
`)),T&&(n+=`@Builder
`)),n+=`public class ${m} {
`,f.forEach(s=>{const c=s.isFinal?"final ":"";n+=`    ${s.accessLevel} ${c}${s.type} ${s.name};
`}),!l&&u&&(n+=`
`,f.forEach(s=>{const c=s.name.charAt(0).toUpperCase()+s.name.slice(1);n+=`    public ${s.type} get${c}() {
`,n+=`        return ${s.name};
`,n+=`    }

`,s.isFinal||(n+=`    public void set${c}(${s.type} ${s.name}) {
`,n+=`        this.${s.name} = ${s.name};
`,n+=`    }

`)})),!l&&y&&(n+=`    @Override
`,n+=`    public String toString() {
`,n+=`        return "${m}{" +
`,f.forEach((s,c)=>{c===0?n+=`            "${s.name}=" + ${s.name}`:n+=` +
            ", ${s.name}=" + ${s.name}`}),n+=` +
            "}";
`,n+=`    }
`),n+="}",k.value=n,b.success("实体类生成成功")}function F(m){navigator.clipboard.writeText(m).then(()=>{b.success("已复制到剪贴板")}).catch(()=>{b.error("复制失败")})}return(m,e)=>(E(),M(H,{rightSidebar:R},{default:o(()=>[i("div",W,[i("div",q,[e[11]||(e[11]=i("h1",{class:"text-2xl font-bold"},"Java 类生成器",-1)),t(a(_),{onClick:e[0]||(e[0]=l=>a(C).push("/tools")),size:"small"},{icon:o(()=>e[9]||(e[9]=[i("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[i("path",{d:"M19 12H5M5 12L12 19M5 12L12 5",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"})],-1)])),default:o(()=>[e[10]||(e[10]=p(" 返回工具列表 "))]),_:1,__:[10]})]),t(a(J),{type:"line",animated:""},{default:o(()=>[t(a(L),{name:"entity",tab:"实体类"},{default:o(()=>[t(a(S),{title:"实体类生成器",class:"mb-4"},{default:o(()=>[i("div",K,[t(a(D),{type:"info"},{default:o(()=>e[12]||(e[12]=[p(" 根据字段定义生成 Java 实体类，支持 Lombok 注解 ")])),_:1,__:[12]})]),i("div",Q,[i("div",null,[e[19]||(e[19]=i("h3",{class:"text-base font-medium mb-2"},"类配置",-1)),t(a(V),null,{default:o(()=>[t(a(v),{label:"类名"},{default:o(()=>[t(a(N),{value:r.value.className,"onUpdate:value":e[1]||(e[1]=l=>r.value.className=l),placeholder:"User"},null,8,["value"])]),_:1}),t(a(v),{label:"包名"},{default:o(()=>[t(a(N),{value:r.value.packageName,"onUpdate:value":e[2]||(e[2]=l=>r.value.packageName=l),placeholder:"com.example.entity"},null,8,["value"])]),_:1}),t(a(v),{label:"选项"},{default:o(()=>[i("div",X,[t(a(g),{checked:r.value.useLombok,"onUpdate:checked":e[3]||(e[3]=l=>r.value.useLombok=l)},{default:o(()=>e[13]||(e[13]=[p("使用 Lombok")])),_:1,__:[13]},8,["checked"]),t(a(g),{checked:r.value.generateGetterSetter,"onUpdate:checked":e[4]||(e[4]=l=>r.value.generateGetterSetter=l)},{default:o(()=>e[14]||(e[14]=[p("Getter/Setter")])),_:1,__:[14]},8,["checked"]),t(a(g),{checked:r.value.generateToString,"onUpdate:checked":e[5]||(e[5]=l=>r.value.generateToString=l)},{default:o(()=>e[15]||(e[15]=[p("toString")])),_:1,__:[15]},8,["checked"]),t(a(g),{checked:r.value.generateBuilder,"onUpdate:checked":e[6]||(e[6]=l=>r.value.generateBuilder=l)},{default:o(()=>e[16]||(e[16]=[p("Builder")])),_:1,__:[16]},8,["checked"])])]),_:1}),t(a(v),{label:"字段"},{default:o(()=>[t(a(z),{value:r.value.fields,"onUpdate:value":e[7]||(e[7]=l=>r.value.fields=l),"on-create":()=>({name:"",type:"String",isPrivate:!0})},{default:o(({value:l})=>[i("div",Y,[t(a(U),{value:l.accessLevel,"onUpdate:value":u=>l.accessLevel=u,class:"col-span-2",options:j},null,8,["value","onUpdate:value"]),t(a(N),{value:l.name,"onUpdate:value":u=>l.name=u,class:"col-span-4",placeholder:"字段名称"},null,8,["value","onUpdate:value"]),t(a(U),{value:l.type,"onUpdate:value":u=>l.type=u,class:"col-span-4",options:w},null,8,["value","onUpdate:value"]),t(a(g),{checked:l.isFinal,"onUpdate:checked":u=>l.isFinal=u,class:"col-span-2"},{default:o(()=>e[17]||(e[17]=[p("final")])),_:2,__:[17]},1032,["checked","onUpdate:checked"])])]),_:1},8,["value"])]),_:1}),t(a(v),null,{default:o(()=>[t(a(_),{type:"primary",onClick:h},{default:o(()=>e[18]||(e[18]=[p("生成实体类")])),_:1,__:[18]})]),_:1})]),_:1})]),i("div",null,[e[21]||(e[21]=i("h3",{class:"text-base font-medium mb-2"},"生成结果",-1)),i("div",Z,[t(a(A),{code:k.value,language:"java","show-line-numbers":""},null,8,["code"])]),t(a(_),{class:"mt-2",size:"small",onClick:e[8]||(e[8]=l=>F(k.value))},{default:o(()=>e[20]||(e[20]=[p(" 复制代码 ")])),_:1,__:[20]})])])]),_:1})]),_:1}),t(a(L),{name:"dto",tab:"DTO/VO"},{default:o(()=>[t(a(S),{title:"DTO/VO 生成器",class:"mb-4"},{default:o(()=>[i("div",ee,[t(a(D),{type:"info"},{default:o(()=>e[22]||(e[22]=[p(" 生成数据传输对象（DTO）或视图对象（VO） ")])),_:1,__:[22]})]),i("div",ae,[t(a(B),{description:"功能开发中，敬请期待"})])]),_:1})]),_:1}),t(a(L),{name:"controller",tab:"Controller"},{default:o(()=>[t(a(S),{title:"Controller 生成器",class:"mb-4"},{default:o(()=>[i("div",te,[t(a(D),{type:"info"},{default:o(()=>e[23]||(e[23]=[p(" 生成 Spring MVC Controller 类 ")])),_:1,__:[23]})]),i("div",le,[t(a(B),{description:"功能开发中，敬请期待"})])]),_:1})]),_:1})]),_:1})])]),_:1}))}}),de=P(se,[["__scopeId","data-v-f9ca6208"]]);export{de as default};
