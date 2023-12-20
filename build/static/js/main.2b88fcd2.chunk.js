(this["webpackJsonpcode-examples-react"]=this["webpackJsonpcode-examples-react"]||[]).push([[0],{46:function(e,t,s){},47:function(e,t,s){},52:function(e,t,s){"use strict";s.r(t);var o=s(0),a=s.n(o),n=s(10),i=s.n(n),c=(s(46),s(36)),r=s(24),l=s(23),d=s(20),h=s(12),p=s(40),u=s(26),g=s(39),m=s(7);const v="codeEg_react",b=e=>{console.log(e)},j="oauthState";class f{static generateId(){const e=new Uint8Array(((arguments.length>0&&void 0!==arguments[0]?arguments[0]:40)||40)/2);return window.crypto.getRandomValues(e),Array.from(e,(function(e){return"0".concat(e.toString(16)).substr(-2)})).join("")}constructor(e){this.app=e,this.oauthWindow=null}async receiveHash(e){const t=window.config;if(!(e&&"#access_token="===e.substring(0,14)))return;var s=e,o=s.match(/scope=([^&]+)/)[1],a=decodeURIComponent(o).replace(/%20/g,"-"),n=s.replace(/scope=([^&]+)/,"scope="+encodeURIComponent(a));if(-1!==n.search(/[^#.\-&=_a-zA-Z0-9]/))return console.error("Potential XSS attack via fragment (#) value: ".concat(n)),void m.b.error("Potential XSS attack via the fragment value. Please login again.",{autoClose:7e3});window.localStorage.getItem(j);const i=/(#access_token=)(.*)(&expires_in=)(.*)(&token_type=)(.*)(&state=)(.*)/.exec(n),c=i[2],r=i[4];window.localStorage.clear(),t.DS_REDIRECT_AUTHENTICATION||this.oauthWindow&&this.oauthWindow.close();let l=new Date;l.setTime(l.getTime()+1e3*(r-600)),this.accessToken=c;const d=m.b.success("Completing the login process...",{autoClose:7e3}),h=await this.fetchUserInfo(),p=h.accounts.filter((e=>e.is_default)),u=p.length>0&&p[0];if(!u){const e="Problem: the user does not have a default account. Contact DocuSign Customer Service to fix.";return b(e),void m.b.error(e,{autoClose:1e4})}let g="https://demo.docusign.net";const v=await this.getExternalAccountId(u.account_id,g);m.b.dismiss(d),this.app.oAuthResults({accessToken:c,expires:l,name:h.name,email:h.email,accountId:u.account_id,externalAccountId:v,accountName:u.account_name,baseUri:g})}startLogin(){const e=window.config,t=f.generateId();let s;window.localStorage.setItem(j,t),s=e.DS_REDIRECT_AUTHENTICATION?e.DS_APP_URL:"".concat(e.DS_APP_URL);const o="".concat(window.config.DS_IDP,"/oauth/auth?")+"response_type=token&"+"scope=".concat(window.config.IMPLICIT_SCOPES,"&")+"client_id=".concat(window.config.DS_CLIENT_ID,"&")+"state=".concat(t,"&")+"redirect_uri=".concat(encodeURIComponent(s));e.DS_REDIRECT_AUTHENTICATION?window.location=o:this.oauthWindow=window.open(o,"_blank")}logout(){const e=window.config,t="".concat(window.config.DS_IDP,"/logout?")+"response_type=token&"+"scope=".concat(e.IMPLICIT_SCOPES,"&")+"client_id=".concat(e.DS_CLIENT_ID,"&")+"redirect_uri=".concat(encodeURIComponent(e.DS_APP_URL),"&")+"response_mode=logout_redirect";window.location=t}async fetchUserInfo(){let e;try{e=await fetch("".concat(window.config.DS_IDP,"/oauth/userinfo"),{headers:new Headers({Authorization:"Bearer ".concat(this.accessToken),Accept:"application/json","X-DocuSign-SDK":v})})}catch(t){const e="Problem while completing login.\nPlease retry.\nError: ".concat(t.toString());return b(e),m.b.error(e,{autoClose:1e4}),null}if(!e||!e.ok){const t="Problem while completing login.\nPlease retry.\nError: ".concat(e.statusText);return b(t),m.b.error(t,{autoClose:1e4}),null}return await e.json()}async getExternalAccountId(e,t){try{const s="".concat(t).concat("/restapi/v2.1","/accounts/").concat(e),o=await fetch(s,{method:"GET",headers:new Headers({Authorization:"Bearer ".concat(this.accessToken),Accept:"application/json","X-DocuSign-SDK":v})});return(o&&o.ok&&await o.json()).externalAccountId}catch(s){return null}}}var w=f;s.p;const x="codeEg_react",I="/restapi/v2.1";var O=class{constructor(e){this.app=e,this.sendEnvelope=this.sendEnvelope.bind(this)}async sendEnvelope(e){const t=new FileReader;await new Promise((s=>{t.onloadend=s,t.readAsDataURL(e)}));const s=t.result.split(",")[1],o={emailSubject:"Please sign the attached document",status:"sent",recipients:{signers:[{email:this.app.state.formEmail,name:this.app.state.formName,recipientId:"1",tabs:{signHereTabs:[{anchorString:"/sn1/",anchorXOffset:"20",anchorUnits:"pixels"}]}}]},documents:[{name:"anchorfields.pdf",fileExtension:"pdf",documentId:"1",documentBase64:s}]};try{const e="".concat(this.app.state.baseUri).concat(I)+"/accounts/".concat(this.app.state.accountId)+"/envelopes",t=await fetch(e,{method:"POST",body:JSON.stringify(o),headers:new Headers({Authorization:"Bearer ".concat(this.app.state.accessToken),Accept:"application/json","Content-Type":"application/json","X-DocuSign-SDK":x})}),s=t&&t.ok&&await t.json();let a;const n=t.headers,i=n.get("X-RateLimit-Remaining"),c=i?parseInt(i,10):void 0,r=n.get("X-RateLimit-Reset"),l=r?new Date(1e3*parseInt(r,10)):void 0,d=n.get("X-DocuSign-TraceToken")||void 0;return a=t.ok?{success:!0,errorMsg:void 0,envelopeId:s.envelopeId,availableApiRequests:c,apiRequestsReset:l,traceId:d}:{success:!1,errorMsg:t&&await t.text(),envelopeId:void 0,availableApiRequests:c,apiRequestsReset:l,traceId:d},a}catch(a){return{success:!1,errorMsg:"Failed to fetch"===a.message?"Networking error\u2014check your Internet and DNS connections":a.message,envelopeId:void 0,availableApiRequests:void 0,apiRequestsReset:void 0,traceId:void 0}}}async getEnvelope(){try{const e="".concat(this.app.state.baseUri).concat(I)+"/accounts/".concat(this.app.state.accountId)+"/envelopes/".concat(this.app.state.responseEnvelopeId),t=await fetch(e,{method:"GET",headers:new Headers({Authorization:"Bearer ".concat(this.app.state.accessToken),Accept:"application/json","Content-Type":"application/json","X-DocuSign-SDK":x})}),s=t&&t.ok&&await t.json();let o;const a=t.headers,n=a.get("X-RateLimit-Remaining"),i=n?parseInt(n,10):void 0,c=a.get("X-RateLimit-Reset"),r=c?new Date(1e3*parseInt(c,10)):void 0,l=a.get("X-DocuSign-TraceToken")||void 0;return o=t.ok?{success:!0,errorMsg:void 0,resultsEnvelopeJson:s,availableApiRequests:i,apiRequestsReset:r,traceId:l}:{success:!1,errorMsg:t&&await t.text(),resultsEnvelopeJson:void 0,availableApiRequests:i,apiRequestsReset:r,traceId:l},o}catch(e){return{success:!1,errorMsg:"Failed to fetch"===e.message?"Networking error\u2014check your Internet and DNS connections":e.message,resultsEnvelopeJson:void 0,availableApiRequests:void 0,apiRequestsReset:void 0,traceId:void 0}}}},S=(s(47),s(25)),E=s(1);class A extends a.a.Component{constructor(e){super(e),this.handleFileChange=e=>{const t=e.target.files;console.log("slecgted fiels",t);const s=Array.from(t).filter((e=>"application/pdf"===e.type));s.length>0?(this.setState({selectedFiles:s,errorMessage:""}),s.forEach((e=>this.convertToBlob(e)))):this.setState({selectedFiles:[],errorMessage:"Please select one or more valid PDF files.",selectedPdfIndex:null})},this.clearState=e=>{console.log("index for clear",e),this.setState((t=>({pdfBlobs:t.pdfBlobs.filter(((t,s)=>s!==e)),selectedPdfIndex:null})))},this.convertToBlob=e=>{const t=new FileReader;t.onloadend=()=>{const s=new Blob([t.result],{type:"application/pdf"}),o={name:e.name,blob:s};this.setState((e=>({pdfBlobs:[...e.pdfBlobs||[],o]})))},t.readAsArrayBuffer(e)},this.showPreviewModal=e=>{this.setState({showModal:!0,selectedPdfPreviewIndex:e})},this.hidePreviewModal=()=>{this.setState({showModal:!1,selectedPdfPreviewIndex:null})},this.state={accessToken:void 0,expires:void 0,name:void 0,email:void 0,externalAccountId:void 0,accountName:void 0,accountId:void 0,baseUri:void 0,page:"welcome",working:!1,workingMessage:"",responseErrorMsg:void 0,responseEnvelopeId:void 0,responseAvailableApiRequests:void 0,responseApiRequestsReset:void 0,responseSuccess:void 0,responseTraceId:void 0,resultsEnvelopeJson:void 0,formName:"",formEmail:"",selectedFile:null,errorMessage:"",pdfBlobs:null,namedBlobs:[],selectedPdfIndex:null,selectedPdfPreviewIndex:null,showModal:!1},this.oAuthImplicit=new w(this),this.docusign=new O(this),this.logout=this.logout.bind(this),this.startAuthentication=this.startAuthentication.bind(this),this.formNameChange=this.formNameChange.bind(this),this.formEmailChange=this.formEmailChange.bind(this),this.sendEnvelope=this.sendEnvelope.bind(this),this.getEnvelope=this.getEnvelope.bind(this),this.receiveMessage=this.receiveMessage.bind(this)}async componentDidMount(){const e=window.config;if(window.location.search&&"?error=logout_request"===window.location.search&&window.history.replaceState(null,"",e.DS_APP_URL),null!==e&&void 0!==e&&e.DS_REDIRECT_AUTHENTICATION){const e=window.location.hash;if(!e)return;this.setState({working:!0,workingMessage:"Logging in"});var t=e.match(/scope=([^&]+)/)[1],s=decodeURIComponent(t).replace(/%20/g,"-"),o=e.replace(/scope=([^&]+)/,"scope="+encodeURIComponent(s));await this.oAuthImplicit.receiveHash(o),this.setState({working:!1})}else window.addEventListener("message",this.receiveMessage,!1)}async receiveMessage(e){console.log("e data",e);const t=e&&e.data&&e.data.source,s=!(!t||{"react-devtools-inject-backend":!0,"react-devtools-content-script":!0,"react-devtools-detector":!0,"react-devtools-bridge":!0}[t])&&t;if(s&&"oauthResponse"===s){this.setState({working:!0,workingMessage:"Logging in"});const t=e.data&&e.data.hash;await this.oAuthImplicit.receiveHash(t),this.setState({working:!1})}}startAuthentication(){this.oAuthImplicit.startLogin()}checkToken(){return!(!this.state.accessToken||void 0===this.state.expires||new Date>this.state.expires)||(this.clearAuth(),this.setState({page:"welcome",working:!1}),m.b.error("Your login session has ended.\nPlease login again",{autoClose:8e3}),!1)}logout(){this.clearAuth(),this.clearState(),this.setState({page:"welcome"}),m.b.success("You have logged out.",{autoClose:5e3}),this.oAuthImplicit.logout()}clearAuth(){this.setState({accessToken:void 0,expires:void 0,accountId:void 0,externalAccountId:void 0,accountName:void 0,baseUri:void 0,name:void 0,email:void 0})}clearState(){this.setState({formName:"",formEmail:"",working:!1,responseErrorMsg:void 0,responseEnvelopeId:void 0,responseAvailableApiRequests:void 0,responseApiRequestsReset:void 0,responseSuccess:void 0,responseTraceId:void 0,resultsEnvelopeJson:void 0})}oAuthResults(e){this.setState({accessToken:e.accessToken,expires:e.expires,name:e.name,externalAccountId:e.externalAccountId,email:e.email,accountId:e.accountId,accountName:e.accountName,baseUri:e.baseUri,page:"loggedIn",formName:e.name,formEmail:e.email}),m.b.success("Welcome ".concat(e.name,", you are now logged in"))}formNameChange(e){this.setState({formName:e.target.value})}formEmailChange(e){this.setState({formEmail:e.target.value})}async sendEnvelope(){if(this.setState({responseErrorMsg:void 0,responseEnvelopeId:void 0,responseAvailableApiRequests:void 0,responseApiRequestsReset:void 0,responseSuccess:void 0,responseTraceId:void 0,resultsEnvelopeJson:void 0}),!this.checkToken())return;if(!this.state.formEmail||this.state.formEmail.length<5)return void m.b.error("Problem: Enter the signer's email address");if(!this.state.formName||this.state.formName.length<5)return void m.b.error("Problem: Enter the signer's name");this.setState({working:!0,workingMessage:"Sending envelope"});const e=await this.docusign.sendEnvelope(this.state.pdfBlobs[this.state.selectedPdfIndex].blob),{apiRequestsReset:t}=e,s=t?new Date(t):void 0;this.setState({working:!1,responseSuccess:e.success,responseErrorMsg:e.errorMsg,responseEnvelopeId:e.envelopeId,responseAvailableApiRequests:e.availableApiRequests,responseTraceId:e.traceId,responseApiRequestsReset:s})}async getEnvelope(){if(this.setState({responseErrorMsg:void 0,responseEnvelopeId:void 0,responseAvailableApiRequests:void 0,responseApiRequestsReset:void 0,responseSuccess:void 0,responseTraceId:void 0}),!this.checkToken())return;if(!this.state.responseEnvelopeId)return void m.b.error("Problem: First send an envelope");this.setState({working:!0,workingMessage:"Fetching the envelope's status"});const e=await this.docusign.getEnvelope(),{apiRequestsReset:t}=e,s=t?new Date(t):void 0;this.setState({working:!1,responseSuccess:e.success,responseErrorMsg:e.errorMsg,responseAvailableApiRequests:e.availableApiRequests,responseTraceId:e.traceId,resultsEnvelopeJson:e.resultsEnvelopeJson,responseApiRequestsReset:s})}render(){let e,t;switch(this.state.page){case"welcome":default:e=this.Welcome();break;case"loggedIn":e=this.LoggedIn()}t=this.state.accessToken?Object(E.jsxs)(u.a.Text,{children:[this.state.name,Object(E.jsx)("br",{}),this.state.accountName," (",this.state.accountId,")",Object(E.jsx)(g.a,{children:Object(E.jsx)(g.a.Link,{href:"#",onClick:()=>this.logout(),children:"Logout"})})]}):null;const s=Object(E.jsxs)(c.a,{fluid:!0,className:"bodyMargin",style:{display:this.state.working?"block":"none"},children:[Object(E.jsx)(r.a,{className:"justify-content-center",children:Object(E.jsx)("div",{className:"spinner"})}),Object(E.jsx)(r.a,{className:"justify-content-center",children:Object(E.jsxs)("h3",{children:[this.state.workingMessage,"\u2026"]})})]});return Object(E.jsxs)(E.Fragment,{children:[Object(E.jsxs)(u.a,{fixed:"top",bg:"primary",variant:"dark",children:[Object(E.jsx)(u.a.Brand,{children:"DocuSign Code Example"}),Object(E.jsx)(u.a.Toggle,{}),Object(E.jsx)(u.a.Collapse,{className:"justify-content-end",children:t})]}),Object(E.jsx)(m.a,{}),s,e]})}LoggedIn(){var e,t,s;const o=this.state.responseApiRequestsReset,a=o?new Intl.DateTimeFormat("en-US",{dateStyle:"medium",timeStyle:"full"}).format(o):void 0;return Object(E.jsxs)(c.a,{className:"bodyMargin",children:[Object(E.jsxs)(r.a,{children:[Object(E.jsxs)(l.a,{className:"col-md-4",children:[Object(E.jsx)("h2",{children:"Send an Envelope"}),Object(E.jsxs)(h.a,{children:[Object(E.jsxs)(h.a.Group,{controlId:"formName",children:[Object(E.jsx)(h.a.Label,{children:"Name"}),Object(E.jsx)(h.a.Control,{type:"text",placeholder:"Name",value:this.state.formName,onChange:this.formNameChange})]}),Object(E.jsxs)(h.a.Group,{controlId:"formEmail",children:[Object(E.jsx)(h.a.Label,{children:"Email"}),Object(E.jsx)(h.a.Control,{type:"email",placeholder:"Email",value:this.state.formEmail,onChange:this.formEmailChange})]}),Object(E.jsxs)(h.a.Group,{children:[Object(E.jsx)("label",{htmlFor:"pdfFile",children:"Choose a PDF file:"}),Object(E.jsx)("br",{}),Object(E.jsxs)(h.a.Group,{className:"custom-file",children:[Object(E.jsx)("input",{type:"file",className:"custom-file-input",id:"pdfFile",accept:".pdf",onChange:this.handleFileChange,multiple:!0}),Object(E.jsx)("label",{className:"custom-file-label",htmlFor:"pdfFile",children:this.state.selectedFile?this.state.selectedFile.name:"Choose file..."})]}),this.state.errorMessage&&Object(E.jsx)("div",{className:"text-danger",children:this.state.errorMessage})]}),Object(E.jsx)(d.a,{variant:"primary",onClick:this.sendEnvelope,children:"Send Envelope"}),Object(E.jsx)(d.a,{variant:"primary",className:"ml-4",onClick:this.getEnvelope,children:"Get Envelope Status"}),Object(E.jsx)("br",{})]})]}),(null===(e=this.state.pdfBlobs)||void 0===e?void 0:e.length)<=2&&Object(E.jsx)("div",{className:"pdf-list",children:(null===(t=this.state.pdfBlobs)||void 0===t?void 0:t.length)>0&&this.state.pdfBlobs.map(((e,t)=>{var s,o,a;return Object(E.jsxs)("div",{style:{width:(null===(s=this.state.pdfBlobs)||void 0===s?void 0:s.length)<5?"25%":"100%"},className:"mt-3 card-list ".concat(t===this.state.selectedPdfIndex?"highlight-pdf":""),onClick:()=>this.setState({selectedPdfIndex:t}),children:[Object(E.jsx)("div",{className:"input-group-append btn-dir",children:Object(E.jsx)(d.a,{type:"button",variant:"red",className:"close","aria-label":"Close",onClick:()=>this.clearState(t),children:Object(E.jsx)("span",{"aria-hidden":"true",className:"btn-dir1",children:"\xd7"})})}),Object(E.jsxs)(h.a.Group,{className:"pdf-algn",style:{width:(null===(o=this.state.pdfBlobs)||void 0===o?void 0:o.length)<3?"50%":"100%"},children:[Object(E.jsx)("img",{className:"card-body",title:"PDF Preview",width:"100%",height:"auto",src:"https://static.vecteezy.com/system/resources/previews/010/750/673/non_2x/pdf-icon-on-white-background-file-pdf-icon-sign-pdf-format-symbol-flat-style-free-vector.jpg"}),Object(E.jsx)("p",{className:"text-alg ".concat(t===this.state.selectedPdfIndex?"highlight-text":""),children:e.name})]}),(null===(a=this.state.pdfBlobs)||void 0===a?void 0:a.length)>0&&null!==this.state.selectedPdfIndex?Object(E.jsx)(d.a,{onClick:()=>this.showPreviewModal(this.state.selectedPdfIndex),children:"Preview"}):""]},t)}))}),Object(E.jsxs)(S.a,{show:this.state.showModal,onHide:this.hidePreviewModal,style:{height:"100vh"},children:[Object(E.jsx)(S.a.Header,{closeButton:!0,children:Object(E.jsx)(S.a.Title,{children:"PDF Preview"})}),Object(E.jsx)(S.a.Body,{children:this.state.pdfBlobs&&null!==this.state.selectedPdfPreviewIndex&&Object(E.jsx)("iframe",{className:"modal-pdf-preview",title:"PDF Preview",width:"100%",height:"auto",src:URL.createObjectURL(this.state.pdfBlobs[this.state.selectedPdfPreviewIndex].blob)})}),Object(E.jsx)(S.a.Footer,{children:Object(E.jsx)(d.a,{variant:"secondary",onClick:this.hidePreviewModal,children:"Close"})})]})]}),(null===(s=this.state.pdfBlobs)||void 0===s?void 0:s.length)>2&&Object(E.jsxs)("table",{class:"table common",children:[Object(E.jsx)("thead",{children:Object(E.jsxs)("tr",{children:[Object(E.jsx)("th",{scope:"col",children:"Sr.No"}),Object(E.jsx)("th",{scope:"col",children:"File Name"}),Object(E.jsx)("th",{scope:"col",children:"Select"}),Object(E.jsx)("th",{scope:"col",children:"Image"})]})}),this.state.pdfBlobs.map(((e,t)=>Object(E.jsx)("tbody",{children:Object(E.jsxs)("tr",{children:[Object(E.jsx)("th",{scope:"row",children:t+1}),Object(E.jsx)("td",{children:e.name}),Object(E.jsxs)("td",{children:[Object(E.jsx)("input",{type:"radio",name:"selectedPdf",checked:t===this.state.selectedPdfIndex,onChange:()=>this.setState({selectedPdfIndex:t})}),Object(E.jsx)(d.a,{onClick:()=>this.showPreviewModal(t),className:"ml-1",children:"Preview"})]}),Object(E.jsxs)("td",{children:[" ",Object(E.jsx)("img",{className:"card-body",title:"PDF Preview",width:"30px",style:{padding:"0"},height:"40px",src:"https://static.vecteezy.com/system/resources/previews/010/750/673/non_2x/pdf-icon-on-white-background-file-pdf-icon-sign-pdf-format-symbol-flat-style-free-vector.jpg"})]})]},t)})))]}),Object(E.jsx)(r.a,{className:"mt-4",children:Object(E.jsxs)(l.a,{children:[Object(E.jsx)("h2",{children:"Results"}),Object(E.jsx)("h2",{children:void 0!==this.state.responseSuccess?this.state.responseSuccess?Object(E.jsxs)(E.Fragment,{children:[this.setState({responseSuccess:void 0}),"\u2705 Success!"]}):Object(E.jsx)(E.Fragment,{children:"\u274c Problem!"}):null}),void 0!==this.state.responseSuccess&&m.b.success("Document sent successfully to ".concat(this.state.formEmail),{autoClose:4e3}),this.state.responseErrorMsg?Object(E.jsxs)("p",{children:["Error message: ",this.state.responseErrorMsg]}):null,this.state.responseEnvelopeId?Object(E.jsxs)("p",{children:["Envelope ID: ",this.state.responseEnvelopeId]}):null,this.state.resultsEnvelopeJson?Object(E.jsx)("p",{children:Object(E.jsxs)("pre",{children:["Response: ",JSON.stringify(this.state.resultsEnvelopeJson,null,4)]})}):null,this.state.responseAvailableApiRequests?Object(E.jsxs)("p",{children:["Available API requests: ",this.state.responseAvailableApiRequests]}):null,a?Object(E.jsxs)("p",{children:["API requests reset time: ",a]}):null,this.state.responseTraceId?Object(E.jsxs)("p",{children:["Trace ID: ",this.state.responseTraceId,". Please include with all customer service questions."]}):null]})})]})}Welcome(){return Object(E.jsx)(c.a,{fluid:!0,className:"welcomeMargin",children:Object(E.jsx)(r.a,{children:Object(E.jsx)(l.a,{children:Object(E.jsxs)(p.a,{children:[Object(E.jsx)("h1",{children:"React Example with OAuth Authentication"}),Object(E.jsx)("p",{children:"OAuth Implicit grant flow."}),Object(E.jsx)("p",{children:"A better Way to Do signature."}),Object(E.jsx)("p",{children:"Login with your DocuSign Developer (Demo) credentials."}),Object(E.jsx)("p",{children:Object(E.jsx)(d.a,{variant:"primary",onClick:this.startAuthentication,children:"Login"})})]})})})})}}var R=A;var P=e=>{e&&e instanceof Function&&s.e(3).then(s.bind(null,54)).then((t=>{let{getCLS:s,getFID:o,getFCP:a,getLCP:n,getTTFB:i}=t;s(e),o(e),a(e),n(e),i(e)}))},k=s(41);i.a.render(Object(E.jsx)(k.a,{children:Object(E.jsx)(R,{})}),document.getElementById("root")),P()}},[[52,1,2]]]);
//# sourceMappingURL=main.2b88fcd2.chunk.js.map