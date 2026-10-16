/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var Wn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},An={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ou=0,Oc=1,au=2;var Qc=1,ta=2,Kn=3,Fn=0,Pt=1,on=2,Ai=0,oi=1,an=2,kc=3,Gc=4,cu=5,Bi=100,lu=101,hu=102,uu=103,du=104,fu=200,pu=201,Au=202,mu=203,Oo=204,Qo=205,gu=206,_u=207,yu=208,Eu=209,xu=210,vu=211,Mu=212,Cu=213,Su=214,na=0,ia=1,sa=2,es=3,ra=4,oa=5,aa=6,ca=7,Hc=0,Iu=1,Tu=2,mi=0,wu=1,bu=2,Ru=3,la=4,Bu=5,Du=6,Fu=7,Ic="attached",Lu="detached",Vc=300,Qi=301,as=302,$s=303,ha=304,ro=306,On=1e3,Rn=1001,Ns=1002,St=1003,er=1004;var cs=1005;var Et=1006,tr=1007;var Kt=1008;var Ue=1009,zc=1010,Wc=1011,nr=1012,ua=1013,ki=1014,Ut=1015,Xt=1016,da=1017,fa=1018,ir=1020,sr=35902,rr=35899,Kc=1021,ls=1022,Tt=1023,Os=1026,or=1027,Xn=1028,pa=1029,gi=1030,Aa=1031;var ma=1033,Gi=33776,_i=33777,Hi=33778,hs=33779,ar=35840,ga=35841,Vi=35842,us=35843,cr=36196,ds=37492,fs=37496,yi=37808,_a=37809,ya=37810,Ea=37811,zi=37812,xa=37813,va=37814,Ma=37815,Ca=37816,Sa=37817,Ia=37818,Ta=37819,wa=37820,ba=37821,Wi=36492,Ra=36494,lr=36495,hr=36283,ur=36284,dr=36285,fr=36286;var ts=2300,ns=2301,No=2302,Tc=2400,wc=2401,bc=2402,Pu=2500;var Xc=0,oo=1,pr=2,Uu=3200,Nu=3201;var qc=0,Ou=1,Mn="",nt="srgb",wt="srgb-linear",Qs="linear",it="srgb";var $i=7680;var Rc=519,Qu=512,ku=513,Gu=514,Yc=515,Hu=516,Vu=517,zu=518,Wu=519,ko=35044,_t=35048;var Jc="300 es",Bn=2e3,Pr=2001;var Qn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}},Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],vh=1234567,Fr=Math.PI/180,is=180/Math.PI;function Dn(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ht[s&255]+Ht[s>>8&255]+Ht[s>>16&255]+Ht[s>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]).toLowerCase()}function Ve(s,e,t){return Math.max(e,Math.min(t,s))}function Zc(s,e){return(s%e+e)%e}function hp(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function up(s,e,t){return s!==e?(t-s)/(e-s):0}function Lr(s,e,t){return(1-t)*s+t*e}function dp(s,e,t,n){return Lr(s,e,1-Math.exp(-t*n))}function fp(s,e=1){return e-Math.abs(Zc(s,e*2)-e)}function pp(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Ap(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function mp(s,e){return s+Math.floor(Math.random()*(e-s+1))}function gp(s,e){return s+Math.random()*(e-s)}function _p(s){return s*(.5-Math.random())}function yp(s){s!==void 0&&(vh=s);let e=vh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ep(s){return s*Fr}function xp(s){return s*is}function vp(s){return(s&s-1)===0&&s!==0}function Mp(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Cp(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Sp(s,e,t,n,i){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),d=r((e-n)/2),f=o((e-n)/2),u=r((n-e)/2),p=o((n-e)/2);switch(i){case"XYX":s.set(a*h,l*d,l*f,a*c);break;case"YZY":s.set(l*f,a*h,l*d,a*c);break;case"ZXZ":s.set(l*d,l*f,a*h,a*c);break;case"XZX":s.set(a*h,l*p,l*u,a*c);break;case"YXY":s.set(l*u,a*h,l*p,a*c);break;case"ZYZ":s.set(l*p,l*u,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function bn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function rt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var qn={DEG2RAD:Fr,RAD2DEG:is,generateUUID:Dn,clamp:Ve,euclideanModulo:Zc,mapLinear:hp,inverseLerp:up,lerp:Lr,damp:dp,pingpong:fp,smoothstep:pp,smootherstep:Ap,randInt:mp,randFloat:gp,randFloatSpread:_p,seededRandom:yp,degToRad:Ep,radToDeg:xp,isPowerOfTwo:vp,ceilPowerOfTwo:Mp,floorPowerOfTwo:Cp,setQuaternionFromProperEuler:Sp,normalize:rt,denormalize:bn},Se=class s{constructor(e=0,t=0){s.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ve(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},bt=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3],f=r[o+0],u=r[o+1],p=r[o+2],g=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(a===1){e[t+0]=f,e[t+1]=u,e[t+2]=p,e[t+3]=g;return}if(d!==g||l!==f||c!==u||h!==p){let m=1-a,A=l*f+c*u+h*p+d*g,x=A>=0?1:-1,v=1-A*A;if(v>Number.EPSILON){let I=Math.sqrt(v),T=Math.atan2(I,A*x);m=Math.sin(m*T)/I,a=Math.sin(a*T)/I}let y=a*x;if(l=l*m+f*y,c=c*m+u*y,h=h*m+p*y,d=d*m+g*y,m===1-a){let I=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=I,c*=I,h*=I,d*=I}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],f=r[o+1],u=r[o+2],p=r[o+3];return e[t]=a*p+h*d+l*u-c*f,e[t+1]=l*p+h*f+c*d-a*u,e[t+2]=c*p+h*u+a*f-l*d,e[t+3]=h*p-a*d-l*f-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),f=l(n/2),u=l(i/2),p=l(r/2);switch(o){case"XYZ":this._x=f*h*d+c*u*p,this._y=c*u*d-f*h*p,this._z=c*h*p+f*u*d,this._w=c*h*d-f*u*p;break;case"YXZ":this._x=f*h*d+c*u*p,this._y=c*u*d-f*h*p,this._z=c*h*p-f*u*d,this._w=c*h*d+f*u*p;break;case"ZXY":this._x=f*h*d-c*u*p,this._y=c*u*d+f*h*p,this._z=c*h*p+f*u*d,this._w=c*h*d-f*u*p;break;case"ZYX":this._x=f*h*d-c*u*p,this._y=c*u*d+f*h*p,this._z=c*h*p-f*u*d,this._w=c*h*d+f*u*p;break;case"YZX":this._x=f*h*d+c*u*p,this._y=c*u*d+f*h*p,this._z=c*h*p-f*u*d,this._w=c*h*d-f*u*p;break;case"XZY":this._x=f*h*d-c*u*p,this._y=c*u*d-f*h*p,this._z=c*h*p+f*u*d,this._w=c*h*d+f*u*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],d=t[10],f=n+a+d;if(f>0){let u=.5/Math.sqrt(f+1);this._w=.25/u,this._x=(h-l)*u,this._y=(r-c)*u,this._z=(o-i)*u}else if(n>a&&n>d){let u=2*Math.sqrt(1+n-a-d);this._w=(h-l)/u,this._x=.25*u,this._y=(i+o)/u,this._z=(r+c)/u}else if(a>d){let u=2*Math.sqrt(1+a-n-d);this._w=(r-c)/u,this._x=(i+o)/u,this._y=.25*u,this._z=(l+h)/u}else{let u=2*Math.sqrt(1+d-n-a);this._w=(o-i)/u,this._x=(r+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ve(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let u=1-t;return this._w=u*o+t*this._w,this._x=u*n+t*this._x,this._y=u*i+t*this._y,this._z=u*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=i*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},w=class s{constructor(e=0,t=0,n=0){s.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Mh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Mh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return $a.copy(this).projectOnVector(e),this.sub($a)}reflect(e){return this.sub($a.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ve(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},$a=new w,Mh=new bt,Pe=class s{constructor(e,t,n,i,r,o,a,l,c){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],u=n[5],p=n[8],g=i[0],m=i[3],A=i[6],x=i[1],v=i[4],y=i[7],I=i[2],T=i[5],R=i[8];return r[0]=o*g+a*x+l*I,r[3]=o*m+a*v+l*T,r[6]=o*A+a*y+l*R,r[1]=c*g+h*x+d*I,r[4]=c*m+h*v+d*T,r[7]=c*A+h*y+d*R,r[2]=f*g+u*x+p*I,r[5]=f*m+u*v+p*T,r[8]=f*A+u*y+p*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=h*o-a*c,f=a*l-h*r,u=c*r-o*l,p=t*d+n*f+i*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/p;return e[0]=d*g,e[1]=(i*c-h*n)*g,e[2]=(a*n-i*o)*g,e[3]=f*g,e[4]=(h*t-i*l)*g,e[5]=(i*r-a*t)*g,e[6]=u*g,e[7]=(n*l-c*t)*g,e[8]=(o*t-n*r)*g,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ec.makeScale(e,t)),this}rotate(e){return this.premultiply(ec.makeRotation(-e)),this}translate(e,t){return this.premultiply(ec.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ec=new Pe;function jc(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function ks(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Ku(){let s=ks("canvas");return s.style.display="block",s}var Ch={};function Gs(s){s in Ch||(Ch[s]=!0,console.warn(s))}function Xu(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Sh=new Pe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ih=new Pe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ip(){let s={enabled:!0,workingColorSpace:wt,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===it&&(i.r=ri(i.r),i.g=ri(i.g),i.b=ri(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===it&&(i.r=Us(i.r),i.g=Us(i.g),i.b=Us(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Mn?Qs:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Gs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Gs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[wt]:{primaries:e,whitePoint:n,transfer:Qs,toXYZ:Sh,fromXYZ:Ih,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:nt},outputColorSpaceConfig:{drawingBufferColorSpace:nt}},[nt]:{primaries:e,whitePoint:n,transfer:it,toXYZ:Sh,fromXYZ:Ih,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:nt}}}),s}var We=Ip();function ri(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Us(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var vs,Go=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{vs===void 0&&(vs=ks("canvas")),vs.width=e.width,vs.height=e.height;let i=vs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=vs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ks("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=ri(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ri(t[n]/255)*255):t[n]=ri(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Tp=0,Hs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Tp++}),this.uuid=Dn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(tc(i[o].image)):r.push(tc(i[o]))}else r=tc(i);n.url=r}return t||(e.images[this.uuid]=n),n}};function tc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Go.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var wp=0,nc=new w,It=class s extends Qn{constructor(e=s.DEFAULT_IMAGE,t=s.DEFAULT_MAPPING,n=Rn,i=Rn,r=Et,o=Kt,a=Tt,l=Ue,c=s.DEFAULT_ANISOTROPY,h=Mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wp++}),this.uuid=Dn(),this.name="",this.source=new Hs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Se(0,0),this.repeat=new Se(1,1),this.center=new Se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Pe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(nc).x}get height(){return this.source.getSize(nc).y}get depth(){return this.source.getSize(nc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Vc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case On:e.x=e.x-Math.floor(e.x);break;case Rn:e.x=e.x<0?0:1;break;case Ns:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case On:e.y=e.y-Math.floor(e.y);break;case Rn:e.y=e.y<0?0:1;break;case Ns:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};It.DEFAULT_IMAGE=null;It.DEFAULT_MAPPING=Vc;It.DEFAULT_ANISOTROPY=1;var $e=class s{constructor(e=0,t=0,n=0,i=1){s.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,l=e.elements,c=l[0],h=l[4],d=l[8],f=l[1],u=l[5],p=l[9],g=l[2],m=l[6],A=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-g)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+g)<.1&&Math.abs(p+m)<.1&&Math.abs(c+u+A-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,y=(u+1)/2,I=(A+1)/2,T=(h+f)/4,R=(d+g)/4,F=(p+m)/4;return v>y&&v>I?v<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(v),i=T/n,r=R/n):y>I?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=T/i,r=F/i):I<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(I),n=R/r,i=F/r),this.set(n,i,r,t),this}let x=Math.sqrt((m-p)*(m-p)+(d-g)*(d-g)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-p)/x,this.y=(d-g)/x,this.z=(f-h)/x,this.w=Math.acos((c+u+A-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this.w=Ve(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this.w=Ve(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ho=class extends Qn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new $e(0,0,e,t),this.scissorTest=!1,this.viewport=new $e(0,0,e,t);let i={width:e,height:t,depth:n.depth},r=new It(i);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Et,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new Hs(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},fn=class extends Ho{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ur=class extends It{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=St,this.minFilter=St,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Vs=class extends It{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=St,this.minFilter=St,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Wt=class{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(In.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(In.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=In.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,In):In.fromBufferAttribute(r,o),In.applyMatrix4(e.matrixWorld),this.expandByPoint(In);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),fo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fo.copy(n.boundingBox)),fo.applyMatrix4(e.matrixWorld),this.union(fo)}let i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,In),In.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Sr),po.subVectors(this.max,Sr),Ms.subVectors(e.a,Sr),Cs.subVectors(e.b,Sr),Ss.subVectors(e.c,Sr),Ci.subVectors(Cs,Ms),Si.subVectors(Ss,Cs),Yi.subVectors(Ms,Ss);let t=[0,-Ci.z,Ci.y,0,-Si.z,Si.y,0,-Yi.z,Yi.y,Ci.z,0,-Ci.x,Si.z,0,-Si.x,Yi.z,0,-Yi.x,-Ci.y,Ci.x,0,-Si.y,Si.x,0,-Yi.y,Yi.x,0];return!ic(t,Ms,Cs,Ss,po)||(t=[1,0,0,0,1,0,0,0,1],!ic(t,Ms,Cs,Ss,po))?!1:(Ao.crossVectors(Ci,Si),t=[Ao.x,Ao.y,Ao.z],ic(t,Ms,Cs,Ss,po))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,In).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(In).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},$n=[new w,new w,new w,new w,new w,new w,new w,new w],In=new w,fo=new Wt,Ms=new w,Cs=new w,Ss=new w,Ci=new w,Si=new w,Yi=new w,Sr=new w,po=new w,Ao=new w,Ji=new w;function ic(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Ji.fromArray(s,r);let a=i.x*Math.abs(Ji.x)+i.y*Math.abs(Ji.y)+i.z*Math.abs(Ji.z),l=e.dot(Ji),c=t.dot(Ji),h=n.dot(Ji);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var bp=new Wt,Ir=new w,sc=new w,en=class{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):bp.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ir.subVectors(e,this.center);let t=Ir.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ir,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(sc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ir.copy(e.center).add(sc)),this.expandByPoint(Ir.copy(e.center).sub(sc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ei=new w,rc=new w,mo=new w,Ii=new w,oc=new w,go=new w,ac=new w,kn=class{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ei.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ei.copy(this.origin).addScaledVector(this.direction,t),ei.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){rc.copy(e).add(t).multiplyScalar(.5),mo.copy(t).sub(e).normalize(),Ii.copy(this.origin).sub(rc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(mo),a=Ii.dot(this.direction),l=-Ii.dot(mo),c=Ii.lengthSq(),h=Math.abs(1-o*o),d,f,u,p;if(h>0)if(d=o*l-a,f=o*a-l,p=r*h,d>=0)if(f>=-p)if(f<=p){let g=1/h;d*=g,f*=g,u=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=r,d=Math.max(0,-(o*f+a)),u=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(o*f+a)),u=-d*d+f*(f+2*l)+c;else f<=-p?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-l),r),u=-d*d+f*(f+2*l)+c):f<=p?(d=0,f=Math.min(Math.max(-r,-l),r),u=f*(f+2*l)+c):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-l),r),u=-d*d+f*(f+2*l)+c);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),u=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(rc).addScaledVector(mo,f),u}intersectSphere(e,t){ei.subVectors(e.center,this.origin);let n=ei.dot(this.direction),i=ei.dot(ei)-n*n,r=e.radius*e.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(a=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,ei)!==null}intersectTriangle(e,t,n,i,r){oc.subVectors(t,e),go.subVectors(n,e),ac.crossVectors(oc,go);let o=this.direction.dot(ac),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ii.subVectors(this.origin,e);let l=a*this.direction.dot(go.crossVectors(Ii,go));if(l<0)return null;let c=a*this.direction.dot(oc.cross(Ii));if(c<0||l+c>o)return null;let h=-a*Ii.dot(ac);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Oe=class s{constructor(e,t,n,i,r,o,a,l,c,h,d,f,u,p,g,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,d,f,u,p,g,m)}set(e,t,n,i,r,o,a,l,c,h,d,f,u,p,g,m){let A=this.elements;return A[0]=e,A[4]=t,A[8]=n,A[12]=i,A[1]=r,A[5]=o,A[9]=a,A[13]=l,A[2]=c,A[6]=h,A[10]=d,A[14]=f,A[3]=u,A[7]=p,A[11]=g,A[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Is.setFromMatrixColumn(e,0).length(),r=1/Is.setFromMatrixColumn(e,1).length(),o=1/Is.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let f=o*h,u=o*d,p=a*h,g=a*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=u+p*c,t[5]=f-g*c,t[9]=-a*l,t[2]=g-f*c,t[6]=p+u*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*h,u=l*d,p=c*h,g=c*d;t[0]=f+g*a,t[4]=p*a-u,t[8]=o*c,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=u*a-p,t[6]=g+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*h,u=l*d,p=c*h,g=c*d;t[0]=f-g*a,t[4]=-o*d,t[8]=p+u*a,t[1]=u+p*a,t[5]=o*h,t[9]=g-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*h,u=o*d,p=a*h,g=a*d;t[0]=l*h,t[4]=p*c-u,t[8]=f*c+g,t[1]=l*d,t[5]=g*c+f,t[9]=u*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,u=o*c,p=a*l,g=a*c;t[0]=l*h,t[4]=g-f*d,t[8]=p*d+u,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=u*d+p,t[10]=f-g*d}else if(e.order==="XZY"){let f=o*l,u=o*c,p=a*l,g=a*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=f*d+g,t[5]=o*h,t[9]=u*d-p,t[2]=p*d-u,t[6]=a*h,t[10]=g*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Rp,e,Bp)}lookAt(e,t,n){let i=this.elements;return un.subVectors(e,t),un.lengthSq()===0&&(un.z=1),un.normalize(),Ti.crossVectors(n,un),Ti.lengthSq()===0&&(Math.abs(n.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),Ti.crossVectors(n,un)),Ti.normalize(),_o.crossVectors(un,Ti),i[0]=Ti.x,i[4]=_o.x,i[8]=un.x,i[1]=Ti.y,i[5]=_o.y,i[9]=un.y,i[2]=Ti.z,i[6]=_o.z,i[10]=un.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],u=n[13],p=n[2],g=n[6],m=n[10],A=n[14],x=n[3],v=n[7],y=n[11],I=n[15],T=i[0],R=i[4],F=i[8],C=i[12],M=i[1],B=i[5],U=i[9],k=i[13],H=i[2],K=i[6],V=i[10],$=i[14],G=i[3],ie=i[7],le=i[11],re=i[15];return r[0]=o*T+a*M+l*H+c*G,r[4]=o*R+a*B+l*K+c*ie,r[8]=o*F+a*U+l*V+c*le,r[12]=o*C+a*k+l*$+c*re,r[1]=h*T+d*M+f*H+u*G,r[5]=h*R+d*B+f*K+u*ie,r[9]=h*F+d*U+f*V+u*le,r[13]=h*C+d*k+f*$+u*re,r[2]=p*T+g*M+m*H+A*G,r[6]=p*R+g*B+m*K+A*ie,r[10]=p*F+g*U+m*V+A*le,r[14]=p*C+g*k+m*$+A*re,r[3]=x*T+v*M+y*H+I*G,r[7]=x*R+v*B+y*K+I*ie,r[11]=x*F+v*U+y*V+I*le,r[15]=x*C+v*k+y*$+I*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],d=e[6],f=e[10],u=e[14],p=e[3],g=e[7],m=e[11],A=e[15];return p*(+r*l*d-i*c*d-r*a*f+n*c*f+i*a*u-n*l*u)+g*(+t*l*u-t*c*f+r*o*f-i*o*u+i*c*h-r*l*h)+m*(+t*c*d-t*a*u-r*o*d+n*o*u+r*a*h-n*c*h)+A*(-i*a*h-t*l*d+t*a*f+i*o*d-n*o*f+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=e[9],f=e[10],u=e[11],p=e[12],g=e[13],m=e[14],A=e[15],x=d*m*c-g*f*c+g*l*u-a*m*u-d*l*A+a*f*A,v=p*f*c-h*m*c-p*l*u+o*m*u+h*l*A-o*f*A,y=h*g*c-p*d*c+p*a*u-o*g*u-h*a*A+o*d*A,I=p*d*l-h*g*l-p*a*f+o*g*f+h*a*m-o*d*m,T=t*x+n*v+i*y+r*I;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/T;return e[0]=x*R,e[1]=(g*f*r-d*m*r-g*i*u+n*m*u+d*i*A-n*f*A)*R,e[2]=(a*m*r-g*l*r+g*i*c-n*m*c-a*i*A+n*l*A)*R,e[3]=(d*l*r-a*f*r-d*i*c+n*f*c+a*i*u-n*l*u)*R,e[4]=v*R,e[5]=(h*m*r-p*f*r+p*i*u-t*m*u-h*i*A+t*f*A)*R,e[6]=(p*l*r-o*m*r-p*i*c+t*m*c+o*i*A-t*l*A)*R,e[7]=(o*f*r-h*l*r+h*i*c-t*f*c-o*i*u+t*l*u)*R,e[8]=y*R,e[9]=(p*d*r-h*g*r-p*n*u+t*g*u+h*n*A-t*d*A)*R,e[10]=(o*g*r-p*a*r+p*n*c-t*g*c-o*n*A+t*a*A)*R,e[11]=(h*a*r-o*d*r-h*n*c+t*d*c+o*n*u-t*a*u)*R,e[12]=I*R,e[13]=(h*g*i-p*d*i+p*n*f-t*g*f-h*n*m+t*d*m)*R,e[14]=(p*a*i-o*g*i-p*n*l+t*g*l+o*n*m-t*a*m)*R,e[15]=(o*d*i-h*a*i+h*n*l-t*d*l-o*n*f+t*a*f)*R,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,d=a+a,f=r*c,u=r*h,p=r*d,g=o*h,m=o*d,A=a*d,x=l*c,v=l*h,y=l*d,I=n.x,T=n.y,R=n.z;return i[0]=(1-(g+A))*I,i[1]=(u+y)*I,i[2]=(p-v)*I,i[3]=0,i[4]=(u-y)*T,i[5]=(1-(f+A))*T,i[6]=(m+x)*T,i[7]=0,i[8]=(p+v)*R,i[9]=(m-x)*R,i[10]=(1-(f+g))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,r=Is.set(i[0],i[1],i[2]).length(),o=Is.set(i[4],i[5],i[6]).length(),a=Is.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Tn.copy(this);let c=1/r,h=1/o,d=1/a;return Tn.elements[0]*=c,Tn.elements[1]*=c,Tn.elements[2]*=c,Tn.elements[4]*=h,Tn.elements[5]*=h,Tn.elements[6]*=h,Tn.elements[8]*=d,Tn.elements[9]*=d,Tn.elements[10]*=d,t.setFromRotationMatrix(Tn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=Bn,l=!1){let c=this.elements,h=2*r/(t-e),d=2*r/(n-i),f=(t+e)/(t-e),u=(n+i)/(n-i),p,g;if(l)p=r/(o-r),g=o*r/(o-r);else if(a===Bn)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Pr)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=Bn,l=!1){let c=this.elements,h=2/(t-e),d=2/(n-i),f=-(t+e)/(t-e),u=-(n+i)/(n-i),p,g;if(l)p=1/(o-r),g=o/(o-r);else if(a===Bn)p=-2/(o-r),g=-(o+r)/(o-r);else if(a===Pr)p=-1/(o-r),g=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Is=new w,Tn=new Oe,Rp=new w(0,0,0),Bp=new w(1,1,1),Ti=new w,_o=new w,un=new w,Th=new Oe,wh=new bt,Ln=class s{constructor(e=0,t=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],f=i[6],u=i[10];switch(t){case"XYZ":this._y=Math.asin(Ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ve(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ve(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,u));break;case"XZY":this._z=Math.asin(-Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Th.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Th,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wh.setFromEuler(this),this.setFromQuaternion(wh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ln.DEFAULT_ORDER="XYZ";var zs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Dp=0,bh=new w,Ts=new bt,ti=new Oe,yo=new w,Tr=new w,Fp=new w,Lp=new bt,Rh=new w(1,0,0),Bh=new w(0,1,0),Dh=new w(0,0,1),Fh={type:"added"},Pp={type:"removed"},ws={type:"childadded",child:null},cc={type:"childremoved",child:null},qe=class s extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=Dn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let e=new w,t=new Ln,n=new bt,i=new w(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Oe},normalMatrix:{value:new Pe}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ts.setFromAxisAngle(e,t),this.quaternion.multiply(Ts),this}rotateOnWorldAxis(e,t){return Ts.setFromAxisAngle(e,t),this.quaternion.premultiply(Ts),this}rotateX(e){return this.rotateOnAxis(Rh,e)}rotateY(e){return this.rotateOnAxis(Bh,e)}rotateZ(e){return this.rotateOnAxis(Dh,e)}translateOnAxis(e,t){return bh.copy(e).applyQuaternion(this.quaternion),this.position.add(bh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Rh,e)}translateY(e){return this.translateOnAxis(Bh,e)}translateZ(e){return this.translateOnAxis(Dh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ti.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?yo.copy(e):yo.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Tr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ti.lookAt(Tr,yo,this.up):ti.lookAt(yo,Tr,this.up),this.quaternion.setFromRotationMatrix(ti),i&&(ti.extractRotation(i.matrixWorld),Ts.setFromRotationMatrix(ti),this.quaternion.premultiply(Ts.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fh),ws.child=e,this.dispatchEvent(ws),ws.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Pp),cc.child=e,this.dispatchEvent(cc),cc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ti.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ti.multiply(e.parent.matrixWorld)),e.applyMatrix4(ti),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fh),ws.child=e,this.dispatchEvent(ws),ws.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,e,Fp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,Lp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),d=o(e.shapes),f=o(e.skeletons),u=o(e.animations),p=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),u.length>0&&(n.animations=u),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};qe.DEFAULT_UP=new w(0,1,0);qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var wn=new w,ni=new w,lc=new w,ii=new w,bs=new w,Rs=new w,Lh=new w,hc=new w,uc=new w,dc=new w,fc=new $e,pc=new $e,Ac=new $e,Ri=class s{constructor(e=new w,t=new w,n=new w){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),wn.subVectors(e,t),i.cross(wn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){wn.subVectors(i,t),ni.subVectors(n,t),lc.subVectors(e,t);let o=wn.dot(wn),a=wn.dot(ni),l=wn.dot(lc),c=ni.dot(ni),h=ni.dot(lc),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let f=1/d,u=(c*l-a*h)*f,p=(o*h-a*l)*f;return r.set(1-u-p,p,u)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,ii)===null?!1:ii.x>=0&&ii.y>=0&&ii.x+ii.y<=1}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,ii)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ii.x),l.addScaledVector(o,ii.y),l.addScaledVector(a,ii.z),l)}static getInterpolatedAttribute(e,t,n,i,r,o){return fc.setScalar(0),pc.setScalar(0),Ac.setScalar(0),fc.fromBufferAttribute(e,t),pc.fromBufferAttribute(e,n),Ac.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(fc,r.x),o.addScaledVector(pc,r.y),o.addScaledVector(Ac,r.z),o}static isFrontFacing(e,t,n,i){return wn.subVectors(n,t),ni.subVectors(e,t),wn.cross(ni).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return wn.subVectors(this.c,this.b),ni.subVectors(this.a,this.b),wn.cross(ni).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return s.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return s.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return s.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return s.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return s.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,o,a;bs.subVectors(i,n),Rs.subVectors(r,n),hc.subVectors(e,n);let l=bs.dot(hc),c=Rs.dot(hc);if(l<=0&&c<=0)return t.copy(n);uc.subVectors(e,i);let h=bs.dot(uc),d=Rs.dot(uc);if(h>=0&&d<=h)return t.copy(i);let f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(bs,o);dc.subVectors(e,r);let u=bs.dot(dc),p=Rs.dot(dc);if(p>=0&&u<=p)return t.copy(r);let g=u*c-l*p;if(g<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(Rs,a);let m=h*p-u*d;if(m<=0&&d-h>=0&&u-p>=0)return Lh.subVectors(r,i),a=(d-h)/(d-h+(u-p)),t.copy(i).addScaledVector(Lh,a);let A=1/(m+g+f);return o=g*A,a=f*A,t.copy(n).addScaledVector(bs,o).addScaledVector(Rs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},qu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wi={h:0,s:0,l:0},Eo={h:0,s:0,l:0};function mc(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}var fe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,We.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=We.workingColorSpace){return this.r=e,this.g=t,this.b=n,We.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=We.workingColorSpace){if(e=Zc(e,1),t=Ve(t,0,1),n=Ve(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=mc(o,r,e+1/3),this.g=mc(o,r,e),this.b=mc(o,r,e-1/3)}return We.colorSpaceToWorking(this,i),this}setStyle(e,t=nt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nt){let n=qu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ri(e.r),this.g=ri(e.g),this.b=ri(e.b),this}copyLinearToSRGB(e){return this.r=Us(e.r),this.g=Us(e.g),this.b=Us(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nt){return We.workingToColorSpace(Vt.copy(this),e),Math.round(Ve(Vt.r*255,0,255))*65536+Math.round(Ve(Vt.g*255,0,255))*256+Math.round(Ve(Vt.b*255,0,255))}getHexString(e=nt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=We.workingColorSpace){We.workingToColorSpace(Vt.copy(this),t);let n=Vt.r,i=Vt.g,r=Vt.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=We.workingColorSpace){return We.workingToColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=nt){We.workingToColorSpace(Vt.copy(this),e);let t=Vt.r,n=Vt.g,i=Vt.b;return e!==nt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(wi),this.setHSL(wi.h+e,wi.s+t,wi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(wi),e.getHSL(Eo);let n=Lr(wi.h,Eo.h,t),i=Lr(wi.s,Eo.s,t),r=Lr(wi.l,Eo.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Vt=new fe;fe.NAMES=qu;var Up=0,tn=class extends Qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Up++}),this.uuid=Dn(),this.name="",this.type="Material",this.blending=oi,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Oo,this.blendDst=Qo,this.blendEquation=Bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fe(0,0,0),this.blendAlpha=0,this.depthFunc=es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Rc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$i,this.stencilZFail=$i,this.stencilZPass=$i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==oi&&(n.blending=this.blending),this.side!==Fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Oo&&(n.blendSrc=this.blendSrc),this.blendDst!==Qo&&(n.blendDst=this.blendDst),this.blendEquation!==Bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==es&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Rc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==$i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==$i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==$i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ot=class extends tn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ln,this.combine=Hc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Mt=new w,xo=new Se,Np=0,Ge=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Np++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ko,this.updateRanges=[],this.gpuType=Ut,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xo.fromBufferAttribute(this,t),xo.applyMatrix3(e),this.setXY(t,xo.x,xo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=bn(t,this.array)),t}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=bn(t,this.array)),t}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=bn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=bn(t,this.array)),t}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array),r=rt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ko&&(e.usage=this.usage),e}};var Nr=class extends Ge{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Or=class extends Ge{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ze=class extends Ge{constructor(e,t,n){super(new Float32Array(e),t,n)}},Op=0,_n=new Oe,gc=new qe,Bs=new w,dn=new Wt,wr=new Wt,Lt=new w,Je=class s extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Op++}),this.uuid=Dn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(jc(e)?Or:Nr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Pe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return _n.makeRotationFromQuaternion(e),this.applyMatrix4(_n),this}rotateX(e){return _n.makeRotationX(e),this.applyMatrix4(_n),this}rotateY(e){return _n.makeRotationY(e),this.applyMatrix4(_n),this}rotateZ(e){return _n.makeRotationZ(e),this.applyMatrix4(_n),this}translate(e,t,n){return _n.makeTranslation(e,t,n),this.applyMatrix4(_n),this}scale(e,t,n){return _n.makeScale(e,t,n),this.applyMatrix4(_n),this}lookAt(e){return gc.lookAt(e),gc.updateMatrix(),this.applyMatrix4(gc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bs).negate(),this.translate(Bs.x,Bs.y,Bs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,r=e.length;i<r;i++){let o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ze(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];dn.setFromBufferAttribute(r),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new en);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(e){let n=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];wr.setFromBufferAttribute(a),this.morphTargetsRelative?(Lt.addVectors(dn.min,wr.min),dn.expandByPoint(Lt),Lt.addVectors(dn.max,wr.max),dn.expandByPoint(Lt)):(dn.expandByPoint(wr.min),dn.expandByPoint(wr.max))}dn.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)Lt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Lt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Lt.fromBufferAttribute(a,c),l&&(Bs.fromBufferAttribute(e,c),Lt.add(Bs)),i=Math.max(i,n.distanceToSquared(Lt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ge(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let F=0;F<n.count;F++)a[F]=new w,l[F]=new w;let c=new w,h=new w,d=new w,f=new Se,u=new Se,p=new Se,g=new w,m=new w;function A(F,C,M){c.fromBufferAttribute(n,F),h.fromBufferAttribute(n,C),d.fromBufferAttribute(n,M),f.fromBufferAttribute(r,F),u.fromBufferAttribute(r,C),p.fromBufferAttribute(r,M),h.sub(c),d.sub(c),u.sub(f),p.sub(f);let B=1/(u.x*p.y-p.x*u.y);isFinite(B)&&(g.copy(h).multiplyScalar(p.y).addScaledVector(d,-u.y).multiplyScalar(B),m.copy(d).multiplyScalar(u.x).addScaledVector(h,-p.x).multiplyScalar(B),a[F].add(g),a[C].add(g),a[M].add(g),l[F].add(m),l[C].add(m),l[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let F=0,C=x.length;F<C;++F){let M=x[F],B=M.start,U=M.count;for(let k=B,H=B+U;k<H;k+=3)A(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let v=new w,y=new w,I=new w,T=new w;function R(F){I.fromBufferAttribute(i,F),T.copy(I);let C=a[F];v.copy(C),v.sub(I.multiplyScalar(I.dot(C))).normalize(),y.crossVectors(T,C);let B=y.dot(l[F])<0?-1:1;o.setXYZW(F,v.x,v.y,v.z,B)}for(let F=0,C=x.length;F<C;++F){let M=x[F],B=M.start,U=M.count;for(let k=B,H=B+U;k<H;k+=3)R(e.getX(k+0)),R(e.getX(k+1)),R(e.getX(k+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ge(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,u=n.count;f<u;f++)n.setXYZ(f,0,0,0);let i=new w,r=new w,o=new w,a=new w,l=new w,c=new w,h=new w,d=new w;if(e)for(let f=0,u=e.count;f<u;f+=3){let p=e.getX(f+0),g=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,p),r.fromBufferAttribute(t,g),o.fromBufferAttribute(t,m),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,u=t.count;f<u;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Lt.fromBufferAttribute(e,t),Lt.normalize(),e.setXYZ(t,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,d=a.normalized,f=new c.constructor(l.length*h),u=0,p=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?u=l[g]*a.data.stride+a.offset:u=l[g]*h;for(let A=0;A<h;A++)f[p++]=c[u++]}return new Ge(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let f=c[h],u=e(f,n);l.push(u)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){let u=c[d];h.push(u.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let f=0,u=d.length;f<u;f++)h.push(d[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ph=new Oe,Zi=new kn,vo=new en,Uh=new w,Mo=new w,Co=new w,So=new w,_c=new w,Io=new w,Nh=new w,To=new w,At=class extends qe{constructor(e=new Je,t=new Ot){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(r&&a){Io.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(_c.fromBufferAttribute(d,e),o?Io.addScaledVector(_c,h):Io.addScaledVector(_c.sub(t),h))}t.add(Io)}return t}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vo.copy(n.boundingSphere),vo.applyMatrix4(r),Zi.copy(e.ray).recast(e.near),!(vo.containsPoint(Zi.origin)===!1&&(Zi.intersectSphere(vo,Uh)===null||Zi.origin.distanceToSquared(Uh)>(e.far-e.near)**2))&&(Ph.copy(r).invert(),Zi.copy(e.ray).applyMatrix4(Ph),!(n.boundingBox!==null&&Zi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Zi)))}_computeIntersections(e,t,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,u=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,g=f.length;p<g;p++){let m=f[p],A=o[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(a.count,Math.min(m.start+m.count,u.start+u.count));for(let y=x,I=v;y<I;y+=3){let T=a.getX(y),R=a.getX(y+1),F=a.getX(y+2);i=wo(this,A,e,n,c,h,d,T,R,F),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let p=Math.max(0,u.start),g=Math.min(a.count,u.start+u.count);for(let m=p,A=g;m<A;m+=3){let x=a.getX(m),v=a.getX(m+1),y=a.getX(m+2);i=wo(this,o,e,n,c,h,d,x,v,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,g=f.length;p<g;p++){let m=f[p],A=o[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(l.count,Math.min(m.start+m.count,u.start+u.count));for(let y=x,I=v;y<I;y+=3){let T=y,R=y+1,F=y+2;i=wo(this,A,e,n,c,h,d,T,R,F),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let p=Math.max(0,u.start),g=Math.min(l.count,u.start+u.count);for(let m=p,A=g;m<A;m+=3){let x=m,v=m+1,y=m+2;i=wo(this,o,e,n,c,h,d,x,v,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}};function Qp(s,e,t,n,i,r,o,a){let l;if(e.side===Pt?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===Fn,a),l===null)return null;To.copy(a),To.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(To);return c<t.near||c>t.far?null:{distance:c,point:To.clone(),object:s}}function wo(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,Mo),s.getVertexPosition(l,Co),s.getVertexPosition(c,So);let h=Qp(s,e,t,n,Mo,Co,So,Nh);if(h){let d=new w;Ri.getBarycoord(Nh,Mo,Co,So,d),i&&(h.uv=Ri.getInterpolatedAttribute(i,a,l,c,d,new Se)),r&&(h.uv1=Ri.getInterpolatedAttribute(r,a,l,c,d,new Se)),o&&(h.normal=Ri.getInterpolatedAttribute(o,a,l,c,d,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new w,materialIndex:0};Ri.getNormal(Mo,Co,So,f.normal),h.face=f,h.barycoord=d}return h}var Di=class s extends Je{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],f=0,u=0;p("z","y","x",-1,-1,n,t,e,o,r,0),p("z","y","x",1,-1,n,t,-e,o,r,1),p("x","z","y",1,1,e,n,t,i,o,2),p("x","z","y",1,-1,e,n,-t,i,o,3),p("x","y","z",1,-1,e,t,n,i,r,4),p("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Ze(c,3)),this.setAttribute("normal",new Ze(h,3)),this.setAttribute("uv",new Ze(d,2));function p(g,m,A,x,v,y,I,T,R,F,C){let M=y/R,B=I/F,U=y/2,k=I/2,H=T/2,K=R+1,V=F+1,$=0,G=0,ie=new w;for(let le=0;le<V;le++){let re=le*B-k;for(let ye=0;ye<K;ye++){let ze=ye*M-U;ie[g]=ze*x,ie[m]=re*v,ie[A]=H,c.push(ie.x,ie.y,ie.z),ie[g]=0,ie[m]=0,ie[A]=T>0?1:-1,h.push(ie.x,ie.y,ie.z),d.push(ye/R),d.push(1-le/F),$+=1}}for(let le=0;le<F;le++)for(let re=0;re<R;re++){let ye=f+re+K*le,ze=f+re+K*(le+1),st=f+(re+1)+K*(le+1),et=f+(re+1)+K*le;l.push(ye,ze,et),l.push(ze,st,et),G+=6}a.addGroup(u,G,C),u+=G,f+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ps(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function qt(s){let e={};for(let t=0;t<s.length;t++){let n=ps(s[t]);for(let i in n)e[i]=n[i]}return e}function kp(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function $c(s){let e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:We.workingColorSpace}var Yu={clone:ps,merge:qt},Gp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ht=class extends tn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gp,this.fragmentShader=Hp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ps(e.uniforms),this.uniformsGroups=kp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Qr=class extends qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=Bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},bi=new w,Oh=new Se,Qh=new Se,Ct=class extends Qr{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=is*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Fr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return is*2*Math.atan(Math.tan(Fr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(bi.x,bi.y).multiplyScalar(-e/bi.z),bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(bi.x,bi.y).multiplyScalar(-e/bi.z)}getViewSize(e,t){return this.getViewBounds(e,Oh,Qh),t.subVectors(Qh,Oh)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Fr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ds=-90,Fs=1,Vo=class extends qe{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Ct(Ds,Fs,e,t);i.layers=this.layers,this.add(i);let r=new Ct(Ds,Fs,e,t);r.layers=this.layers,this.add(r);let o=new Ct(Ds,Fs,e,t);o.layers=this.layers,this.add(o);let a=new Ct(Ds,Fs,e,t);a.layers=this.layers,this.add(a);let l=new Ct(Ds,Fs,e,t);l.layers=this.layers,this.add(l);let c=new Ct(Ds,Fs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Bn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Pr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(d,f,u),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},kr=class extends It{constructor(e=[],t=Qi,n,i,r,o,a,l,c,h){super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},zo=class extends fn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new kr(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Di(5,5,5),r=new ht({name:"CubemapFromEquirect",uniforms:ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Pt,blending:Ai});r.uniforms.tEquirect.value=t;let o=new At(i,r),a=t.minFilter;return t.minFilter===Kt&&(t.minFilter=Et),new Vo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}},zt=class extends qe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Vp={type:"move"},Ws=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let g of e.hand.values()){let m=t.getJointPose(g,n),A=this._getHandJoint(c,g);m!==null&&(A.matrix.fromArray(m.transform.matrix),A.matrix.decompose(A.position,A.rotation,A.scale),A.matrixWorldNeedsUpdate=!0,A.jointRadius=m.radius),A.visible=m!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),u=.02,p=.005;c.inputState.pinching&&f>u+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=u-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Vp)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new zt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var Gr=class extends qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ln,this.environmentIntensity=1,this.environmentRotation=new Ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ks=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ko,this.updateRanges=[],this.version=0,this.uuid=Dn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Jt=new w,Xs=class s{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix4(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyNormalMatrix(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.transformDirection(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=bn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=bn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=bn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=bn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array),r=rt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Ge(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new s(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var kh=new w,Gh=new $e,Hh=new $e,zp=new w,Vh=new Oe,bo=new w,yc=new en,zh=new Oe,Ec=new kn,Hr=class extends At{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ic,this.bindMatrix=new Oe,this.bindMatrixInverse=new Oe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Wt),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,bo),this.boundingBox.expandByPoint(bo)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new en),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,bo),this.boundingSphere.expandByPoint(bo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yc.copy(this.boundingSphere),yc.applyMatrix4(i),e.ray.intersectsSphere(yc)!==!1&&(zh.copy(i).invert(),Ec.copy(e.ray).applyMatrix4(zh),!(this.boundingBox!==null&&Ec.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ec)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new $e,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Ic?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Lu?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;Gh.fromBufferAttribute(i.attributes.skinIndex,e),Hh.fromBufferAttribute(i.attributes.skinWeight,e),kh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=Hh.getComponent(r);if(o!==0){let a=Gh.getComponent(r);Vh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(zp.copy(kh).applyMatrix4(Vh),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},qs=class extends qe{constructor(){super(),this.isBone=!0,this.type="Bone"}},ai=class extends It{constructor(e=null,t=1,n=1,i,r,o,a,l,c=St,h=St,d,f){super(null,o,a,l,c,h,i,r,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Wh=new Oe,Wp=new Oe,Vr=class s{constructor(e=[],t=[]){this.uuid=Dn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Oe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Oe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:Wp;Wh.multiplyMatrices(a,t[r]),Wh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new ai(t,e,e,Tt,Ut);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new qs),this.bones.push(o),this.boneInverses.push(new Oe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){let o=t[i];e.bones.push(o.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},Fi=class extends Ge{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ls=new Oe,Kh=new Oe,Ro=[],Xh=new Wt,Kp=new Oe,br=new At,Rr=new en,Zt=class extends At{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Fi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Kp)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Wt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ls),Xh.copy(e.boundingBox).applyMatrix4(Ls),this.boundingBox.union(Xh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new en),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ls),Rr.copy(e.boundingSphere).applyMatrix4(Ls),this.boundingSphere.union(Rr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(br.geometry=this.geometry,br.material=this.material,br.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Rr.copy(this.boundingSphere),Rr.applyMatrix4(n),e.ray.intersectsSphere(Rr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ls),Kh.multiplyMatrices(n,Ls),br.matrixWorld=Kh,br.raycast(e,Ro);for(let o=0,a=Ro.length;o<a;o++){let l=Ro[o];l.instanceId=r,l.object=this,t.push(l)}Ro.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Fi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new ai(new Float32Array(i*this.count),i,this.count,Xn,Ut));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},xc=new w,Xp=new w,qp=new Pe,yn=class{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=xc.subVectors(n,t).cross(Xp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(xc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||qp.getNormalMatrix(e),i=this.coplanarPoint(xc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ji=new en,Yp=new Se(.5,.5),Bo=new w,Ys=class{constructor(e=new yn,t=new yn,n=new yn,i=new yn,r=new yn,o=new yn){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Bn,n=!1){let i=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],f=r[6],u=r[7],p=r[8],g=r[9],m=r[10],A=r[11],x=r[12],v=r[13],y=r[14],I=r[15];if(i[0].setComponents(c-o,u-h,A-p,I-x).normalize(),i[1].setComponents(c+o,u+h,A+p,I+x).normalize(),i[2].setComponents(c+a,u+d,A+g,I+v).normalize(),i[3].setComponents(c-a,u-d,A-g,I-v).normalize(),n)i[4].setComponents(l,f,m,y).normalize(),i[5].setComponents(c-l,u-f,A-m,I-y).normalize();else if(i[4].setComponents(c-l,u-f,A-m,I-y).normalize(),t===Bn)i[5].setComponents(c+l,u+f,A+m,I+y).normalize();else if(t===Pr)i[5].setComponents(l,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ji.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ji.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ji)}intersectsSprite(e){ji.center.set(0,0,0);let t=Yp.distanceTo(e.center);return ji.radius=.7071067811865476+t,ji.applyMatrix4(e.matrixWorld),this.intersectsSphere(ji)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Bo.x=i.normal.x>0?e.max.x:e.min.x,Bo.y=i.normal.y>0?e.max.y:e.min.y,Bo.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Bo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var nn=class extends tn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Wo=new w,Ko=new w,qh=new Oe,Br=new kn,Do=new en,vc=new w,Yh=new w,ss=class extends qe{constructor(e=new Je,t=new nn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Wo.fromBufferAttribute(t,i-1),Ko.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Wo.distanceTo(Ko);e.setAttribute("lineDistance",new Ze(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Do.copy(n.boundingSphere),Do.applyMatrix4(i),Do.radius+=r,e.ray.intersectsSphere(Do)===!1)return;qh.copy(i).invert(),Br.copy(e.ray).applyMatrix4(qh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let u=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=u,m=p-1;g<m;g+=c){let A=h.getX(g),x=h.getX(g+1),v=Fo(this,e,Br,l,A,x,g);v&&t.push(v)}if(this.isLineLoop){let g=h.getX(p-1),m=h.getX(u),A=Fo(this,e,Br,l,g,m,p-1);A&&t.push(A)}}else{let u=Math.max(0,o.start),p=Math.min(f.count,o.start+o.count);for(let g=u,m=p-1;g<m;g+=c){let A=Fo(this,e,Br,l,g,g+1,g);A&&t.push(A)}if(this.isLineLoop){let g=Fo(this,e,Br,l,p-1,u,p-1);g&&t.push(g)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Fo(s,e,t,n,i,r,o){let a=s.geometry.attributes.position;if(Wo.fromBufferAttribute(a,i),Ko.fromBufferAttribute(a,r),t.distanceSqToSegment(Wo,Ko,vc,Yh)>n)return;vc.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(vc);if(!(c<e.near||c>e.far))return{distance:c,point:Yh.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}var Jh=new w,Zh=new w,pn=class extends ss{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Jh.fromBufferAttribute(t,i),Zh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Jh.distanceTo(Zh);e.setAttribute("lineDistance",new Ze(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},zr=class extends ss{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Li=class extends tn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},jh=new Oe,Bc=new kn,Lo=new en,Po=new w,En=class extends qe{constructor(e=new Je,t=new Li){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Lo.copy(n.boundingSphere),Lo.applyMatrix4(i),Lo.radius+=r,e.ray.intersectsSphere(Lo)===!1)return;jh.copy(i).invert(),Bc.copy(e.ray).applyMatrix4(jh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let f=Math.max(0,o.start),u=Math.min(c.count,o.start+o.count);for(let p=f,g=u;p<g;p++){let m=c.getX(p);Po.fromBufferAttribute(d,m),$h(Po,m,l,i,e,t,this)}}else{let f=Math.max(0,o.start),u=Math.min(d.count,o.start+o.count);for(let p=f,g=u;p<g;p++)Po.fromBufferAttribute(d,p),$h(Po,p,l,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function $h(s,e,t,n,i,r,o){let a=Bc.distanceSqToPoint(s);if(a<t){let l=new w;Bc.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Pi=class extends It{constructor(e,t,n,i,r,o,a,l,c,h,d,f){super(null,o,a,l,c,h,i,r,d,f),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}},Wr=class extends Pi{constructor(e,t,n,i,r,o){super(e,t,n,r,o),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=Rn,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Kr=class extends Pi{constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,Qi),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}},Ui=class extends It{constructor(e,t,n,i,r,o,a,l,c){super(e,t,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Xr=class extends It{constructor(e,t,n=ki,i,r,o,a=St,l=St,c,h=Os,d=1){if(h!==Os&&h!==or)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:d};super(f,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Hs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},qr=class extends It{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Pn=class s extends Je{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],d=[],f=[],u=[],p=0,g=[],m=n/2,A=0;x(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Ze(d,3)),this.setAttribute("normal",new Ze(f,3)),this.setAttribute("uv",new Ze(u,2));function x(){let y=new w,I=new w,T=0,R=(t-e)/n;for(let F=0;F<=r;F++){let C=[],M=F/r,B=M*(t-e)+e;for(let U=0;U<=i;U++){let k=U/i,H=k*l+a,K=Math.sin(H),V=Math.cos(H);I.x=B*K,I.y=-M*n+m,I.z=B*V,d.push(I.x,I.y,I.z),y.set(K,R,V).normalize(),f.push(y.x,y.y,y.z),u.push(k,1-M),C.push(p++)}g.push(C)}for(let F=0;F<i;F++)for(let C=0;C<r;C++){let M=g[C][F],B=g[C+1][F],U=g[C+1][F+1],k=g[C][F+1];(e>0||C!==0)&&(h.push(M,B,k),T+=3),(t>0||C!==r-1)&&(h.push(B,U,k),T+=3)}c.addGroup(A,T,0),A+=T}function v(y){let I=p,T=new Se,R=new w,F=0,C=y===!0?e:t,M=y===!0?1:-1;for(let U=1;U<=i;U++)d.push(0,m*M,0),f.push(0,M,0),u.push(.5,.5),p++;let B=p;for(let U=0;U<=i;U++){let H=U/i*l+a,K=Math.cos(H),V=Math.sin(H);R.x=C*V,R.y=m*M,R.z=C*K,d.push(R.x,R.y,R.z),f.push(0,M,0),T.x=K*.5+.5,T.y=V*.5*M+.5,u.push(T.x,T.y),p++}for(let U=0;U<i;U++){let k=I+U,H=B+U;y===!0?h.push(H,H+1,k):h.push(H+1,H,k),F+=3}c.addGroup(A,F,y===!0?1:2),A+=F}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ci=class s extends Pn{constructor(e=1,t=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new s(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Ni=class s extends Je{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=e/a,f=t/l,u=[],p=[],g=[],m=[];for(let A=0;A<h;A++){let x=A*f-o;for(let v=0;v<c;v++){let y=v*d-r;p.push(y,-x,0),g.push(0,0,1),m.push(v/a),m.push(1-A/l)}}for(let A=0;A<l;A++)for(let x=0;x<a;x++){let v=x+c*A,y=x+c*(A+1),I=x+1+c*(A+1),T=x+1+c*A;u.push(v,y,T),u.push(y,I,T)}this.setIndex(u),this.setAttribute("position",new Ze(p,3)),this.setAttribute("normal",new Ze(g,3)),this.setAttribute("uv",new Ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.widthSegments,e.heightSegments)}};var li=class s extends Je{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new w,f=new w,u=[],p=[],g=[],m=[];for(let A=0;A<=n;A++){let x=[],v=A/n,y=0;A===0&&o===0?y=.5/t:A===n&&l===Math.PI&&(y=-.5/t);for(let I=0;I<=t;I++){let T=I/t;d.x=-e*Math.cos(i+T*r)*Math.sin(o+v*a),d.y=e*Math.cos(o+v*a),d.z=e*Math.sin(i+T*r)*Math.sin(o+v*a),p.push(d.x,d.y,d.z),f.copy(d).normalize(),g.push(f.x,f.y,f.z),m.push(T+y,1-v),x.push(c++)}h.push(x)}for(let A=0;A<n;A++)for(let x=0;x<t;x++){let v=h[A][x+1],y=h[A][x],I=h[A+1][x],T=h[A+1][x+1];(A!==0||o>0)&&u.push(v,y,T),(A!==n-1||l<Math.PI)&&u.push(y,I,T)}this.setIndex(u),this.setAttribute("position",new Ze(p,3)),this.setAttribute("normal",new Ze(g,3)),this.setAttribute("uv",new Ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Yr=class extends ht{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},xn=class extends tn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qc,this.normalScale=new Se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},sn=class extends xn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Se(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ve(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new fe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new fe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new fe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Xo=class extends tn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Uu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},qo=class extends tn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};var Jr=class extends nn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function Uo(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Jp(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Zp(s){function e(i,r){return s[i]-s[r]}let t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function eu(s,e,t){let n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let l=0;l!==e;++l)i[o++]=s[a+l]}return i}function Ju(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}var hi=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Yo=class extends hi{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Tc,endingEnd:Tc}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,o=e+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case wc:r=e,a=2*t-n;break;case bc:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case wc:o=e,l=2*n-t;break;case bc:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,u=this._weightNext,p=(n-t)/(i-t),g=p*p,m=g*p,A=-f*m+2*f*g-f*p,x=(1+f)*m+(-1.5-2*f)*g+(-.5+f)*p+1,v=(-1-u)*m+(1.5+u)*g+.5*p,y=u*m-u*g;for(let I=0;I!==a;++I)r[I]=A*o[h+I]+x*o[c+I]+v*o[l+I]+y*o[d+I];return r}},Jo=class extends hi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(i-t),d=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*d+o[l+f]*h;return r}},Zo=class extends hi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},rn=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Uo(t,this.TimeBufferType),this.values=Uo(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Uo(e.times,Array),values:Uo(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Zo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Jo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Yo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ts:t=this.InterpolantFactoryMethodDiscrete;break;case ns:t=this.InterpolantFactoryMethodLinear;break;case No:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ts;case this.InterpolantFactoryMethodLinear:return ns;case this.InterpolantFactoryMethodSmooth:return No}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&Jp(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===No,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(i)l=!0;else{let d=a*n,f=d-n,u=d+n;for(let p=0;p!==n;++p){let g=t[d+p];if(g!==t[f+p]||g!==t[u+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*n,f=o*n;for(let u=0;u!==n;++u)t[f+u]=t[d+u]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};rn.prototype.ValueTypeName="";rn.prototype.TimeBufferType=Float32Array;rn.prototype.ValueBufferType=Float32Array;rn.prototype.DefaultInterpolation=ns;var ui=class extends rn{constructor(e,t,n){super(e,t,n)}};ui.prototype.ValueTypeName="bool";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=ts;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;var Zr=class extends rn{constructor(e,t,n,i){super(e,t,n,i)}};Zr.prototype.ValueTypeName="color";var Gn=class extends rn{constructor(e,t,n,i){super(e,t,n,i)}};Gn.prototype.ValueTypeName="number";var jo=class extends hi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t),c=e*a;for(let h=c+a;c!==h;c+=4)bt.slerpFlat(r,0,o,c-a,o,c,l);return r}},Hn=class extends rn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new jo(this.times,this.values,this.getValueSize(),e)}};Hn.prototype.ValueTypeName="quaternion";Hn.prototype.InterpolantFactoryMethodSmooth=void 0;var di=class extends rn{constructor(e,t,n){super(e,t,n)}};di.prototype.ValueTypeName="string";di.prototype.ValueBufferType=Array;di.prototype.DefaultInterpolation=ts;di.prototype.InterpolantFactoryMethodLinear=void 0;di.prototype.InterpolantFactoryMethodSmooth=void 0;var Vn=class extends rn{constructor(e,t,n,i){super(e,t,n,i)}};Vn.prototype.ValueTypeName="vector";var jr=class{constructor(e="",t=-1,n=[],i=Pu){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Dn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push($p(n[o]).scale(i));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(rn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let h=Zp(l);l=eu(l,1,h),c=eu(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new Gn(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],h=c.name.match(r);if(h&&h.length>1){let d=h[1],f=i[d];f||(i[d]=f=[]),f.push(c)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(d,f,u,p,g){if(u.length!==0){let m=[],A=[];Ju(u,m,A,p),m.length!==0&&g.push(new d(f,m,A))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let d=0;d<c.length;d++){let f=c[d].keys;if(!(!f||f.length===0))if(f[0].morphTargets){let u={},p;for(p=0;p<f.length;p++)if(f[p].morphTargets)for(let g=0;g<f[p].morphTargets.length;g++)u[f[p].morphTargets[g]]=-1;for(let g in u){let m=[],A=[];for(let x=0;x!==f[p].morphTargets.length;++x){let v=f[p];m.push(v.time),A.push(v.morphTarget===g?1:0)}i.push(new Gn(".morphTargetInfluence["+g+"]",m,A))}l=u.length*o}else{let u=".bones["+t[d].name+"]";n(Vn,u+".position",f,"pos",i),n(Hn,u+".quaternion",f,"rot",i),n(Vn,u+".scale",f,"scl",i)}}return i.length===0?null:new this(r,l,i,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function jp(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Gn;case"vector":case"vector2":case"vector3":case"vector4":return Vn;case"color":return Zr;case"quaternion":return Hn;case"bool":case"boolean":return ui;case"string":return di}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function $p(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=jp(s.type);if(s.times===void 0){let t=[],n=[];Ju(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}var Nn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}},Js=class{constructor(e,t,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=c.length;d<f;d+=2){let u=c[d],p=c[d+1];if(u.global&&(u.lastIndex=0),u.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Zu=new Js,vn=class{constructor(e){this.manager=e!==void 0?e:Zu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};vn.DEFAULT_MATERIAL_NAME="__DEFAULT";var si={},Dc=class extends Error{constructor(e,t){super(e),this.response=t}},zn=class extends vn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Nn.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(si[e]!==void 0){si[e].push({onLoad:t,onProgress:n,onError:i});return}si[e]=[],si[e].push({onLoad:t,onProgress:n,onError:i});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=si[e],d=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),u=f?parseInt(f):0,p=u!==0,g=0,m=new ReadableStream({start(A){x();function x(){d.read().then(({done:v,value:y})=>{if(v)A.close();else{g+=y.byteLength;let I=new ProgressEvent("progress",{lengthComputable:p,loaded:g,total:u});for(let T=0,R=h.length;T<R;T++){let F=h[T];F.onProgress&&F.onProgress(I)}A.enqueue(y),x()}},v=>{A.error(v)})}}});return new Response(m)}else throw new Dc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),f=d&&d[1]?d[1].toLowerCase():void 0,u=new TextDecoder(f);return c.arrayBuffer().then(p=>u.decode(p))}}}).then(c=>{Nn.add(`file:${e}`,c);let h=si[e];delete si[e];for(let d=0,f=h.length;d<f;d++){let u=h[d];u.onLoad&&u.onLoad(c)}}).catch(c=>{let h=si[e];if(h===void 0)throw this.manager.itemError(e),c;delete si[e];for(let d=0,f=h.length;d<f;d++){let u=h[d];u.onError&&u.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ps=new WeakMap,$o=class extends vn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Nn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let d=Ps.get(o);d===void 0&&(d=[],Ps.set(o,d)),d.push({onLoad:t,onError:i})}return o}let a=ks("img");function l(){h(),t&&t(this);let d=Ps.get(this)||[];for(let f=0;f<d.length;f++){let u=d[f];u.onLoad&&u.onLoad(this)}Ps.delete(this),r.manager.itemEnd(e)}function c(d){h(),i&&i(d),Nn.remove(`image:${e}`);let f=Ps.get(this)||[];for(let u=0;u<f.length;u++){let p=f[u];p.onError&&p.onError(d)}Ps.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Nn.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}};var $r=class extends vn{constructor(e){super(e)}load(e,t,n,i){let r=new It,o=new $o(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}},rs=class extends qe{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new fe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},eo=class extends rs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new fe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Mc=new Oe,tu=new w,nu=new w,to=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Se(512,512),this.mapType=Ue,this.map=null,this.mapPass=null,this.matrix=new Oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ys,this._frameExtents=new Se(1,1),this._viewportCount=1,this._viewports=[new $e(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;tu.setFromMatrixPosition(e.matrixWorld),t.position.copy(tu),nu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(nu),t.updateMatrixWorld(),Mc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Mc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Mc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Fc=class extends to{constructor(){super(new Ct(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=is*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},no=class extends rs{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.target=new qe,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Fc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},iu=new Oe,Dr=new w,Cc=new w,Lc=class extends to{constructor(){super(new Ct(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Se(4,2),this._viewportCount=6,this._viewports=[new $e(2,1,1,1),new $e(0,1,1,1),new $e(3,1,1,1),new $e(1,1,1,1),new $e(3,0,1,1),new $e(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Dr.setFromMatrixPosition(e.matrixWorld),n.position.copy(Dr),Cc.copy(n.position),Cc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Cc),n.updateMatrixWorld(),i.makeTranslation(-Dr.x,-Dr.y,-Dr.z),iu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(iu,n.coordinateSystem,n.reversedDepth)}},os=class extends rs{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Lc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},fi=class extends Qr{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Pc=class extends to{constructor(){super(new fi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Oi=class extends rs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.target=new qe,this.shadow=new Pc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var pi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Sc=new WeakMap,io=class extends vn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Nn.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{if(Sc.has(o)===!0)i&&i(Sc.get(o)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Nn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Sc.set(l,c),Nn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Nn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var ea=class extends Ct{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var el="\\[\\]\\.:\\/",eA=new RegExp("["+el+"]","g"),tl="[^"+el+"]",tA="[^"+el.replace("\\.","")+"]",nA=/((?:WC+[\/:])*)/.source.replace("WC",tl),iA=/(WCOD+)?/.source.replace("WCOD",tA),sA=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",tl),rA=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",tl),oA=new RegExp("^"+nA+iA+sA+rA+"$"),aA=["material","materials","bones","map"],Uc=class{constructor(e,t,n){let i=n||lt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},lt=class s{constructor(e,t,n){this.path=t,this.parsedPath=n||s.parseTrackName(t),this.node=s.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new s.Composite(e,t,n):new s(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(eA,"")}static parseTrackName(e){let t=oA.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);aA.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,r=t.propertyIndex;if(e||(e=s.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[i];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};lt.Composite=Uc;lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};lt.prototype.GetterByBindingType=[lt.prototype._getValue_direct,lt.prototype._getValue_array,lt.prototype._getValue_arrayElement,lt.prototype._getValue_toArray];lt.prototype.SetterByBindingTypeAndVersioning=[[lt.prototype._setValue_direct,lt.prototype._setValue_direct_setNeedsUpdate,lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_array,lt.prototype._setValue_array_setNeedsUpdate,lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_arrayElement,lt.prototype._setValue_arrayElement_setNeedsUpdate,lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_fromArray,lt.prototype._setValue_fromArray_setNeedsUpdate,lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var My=new Float32Array(1);var su=new Oe,Zs=class{constructor(e,t,n=0,i=1/0){this.ray=new kn(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new zs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return su.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(su),this}intersectObject(e,t=!0,n=[]){return Nc(e,this,n,t),n.sort(ru),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Nc(e[i],this,n,t);return n.sort(ru),n}};function ru(s,e){return s.distance-e.distance}function Nc(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let o=0,a=r.length;o<a;o++)Nc(r[o],e,t,!0)}}var js=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ve(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ve(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var so=class extends Qn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function nl(s,e,t,n){let i=cA(n);switch(t){case Kc:return s*e;case Xn:return s*e/i.components*i.byteLength;case pa:return s*e/i.components*i.byteLength;case gi:return s*e*2/i.components*i.byteLength;case Aa:return s*e*2/i.components*i.byteLength;case ls:return s*e*3/i.components*i.byteLength;case Tt:return s*e*4/i.components*i.byteLength;case ma:return s*e*4/i.components*i.byteLength;case Gi:case _i:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Hi:case hs:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ga:case us:return Math.max(s,16)*Math.max(e,8)/4;case ar:case Vi:return Math.max(s,8)*Math.max(e,8)/2;case cr:case ds:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case fs:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case yi:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case _a:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case ya:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Ea:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case zi:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case xa:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case va:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Ma:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Ca:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Sa:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Ia:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Ta:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case wa:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case ba:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Wi:case Ra:case lr:return Math.ceil(s/4)*Math.ceil(e/4)*16;case hr:case ur:return Math.ceil(s/4)*Math.ceil(e/4)*8;case dr:case fr:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function cA(s){switch(s){case Ue:case zc:return{byteLength:1,components:1};case nr:case Wc:case Xt:return{byteLength:2,components:1};case da:case fa:return{byteLength:2,components:4};case ki:case ua:case Ut:return{byteLength:4,components:1};case sr:case rr:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function xd(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function hA(s){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,d=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,h),a.onUploadCallback();let u;if(c instanceof Float32Array)u=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?u=s.HALF_FLOAT:u=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=s.SHORT;else if(c instanceof Uint32Array)u=s.UNSIGNED_INT;else if(c instanceof Int32Array)u=s.INT;else if(c instanceof Int8Array)u=s.BYTE;else if(c instanceof Uint8Array)u=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let h=l.array,d=l.updateRanges;if(s.bindBuffer(c,a),d.length===0)s.bufferSubData(c,0,h);else{d.sort((u,p)=>u.start-p.start);let f=0;for(let u=1;u<d.length;u++){let p=d[f],g=d[u];g.start<=p.start+p.count+1?p.count=Math.max(p.count,g.start+g.count-p.start):(++f,d[f]=g)}d.length=f+1;for(let u=0,p=d.length;u<p;u++){let g=d[u];s.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var uA=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dA=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fA=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pA=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,AA=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mA=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gA=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,_A=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yA=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,EA=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xA=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vA=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,MA=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,CA=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,SA=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,IA=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,TA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bA=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,RA=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,BA=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,DA=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,FA=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,LA=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,PA=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,UA=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,NA=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,OA=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,QA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,GA="gl_FragColor = linearToOutputTexel( gl_FragColor );",HA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,VA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,zA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,WA=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,KA=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,XA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,YA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,JA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ZA=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jA=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,$A=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,em=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,im=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,sm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,om=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,am=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,hm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,um=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,dm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Am=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_m=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ym=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Em=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Im=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Tm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,bm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Rm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Fm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Lm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Um=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Om=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Qm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,km=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Km=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Xm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,qm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ym=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Jm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,jm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$m=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,eg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ng=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ig=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,sg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,rg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ag=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,lg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,hg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ug=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ag=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,gg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,_g=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,yg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Mg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Cg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Sg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ig=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,bg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Bg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Pg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ug=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ng=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Og=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Qg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Hg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:uA,alphahash_pars_fragment:dA,alphamap_fragment:fA,alphamap_pars_fragment:pA,alphatest_fragment:AA,alphatest_pars_fragment:mA,aomap_fragment:gA,aomap_pars_fragment:_A,batching_pars_vertex:yA,batching_vertex:EA,begin_vertex:xA,beginnormal_vertex:vA,bsdfs:MA,iridescence_fragment:CA,bumpmap_pars_fragment:SA,clipping_planes_fragment:IA,clipping_planes_pars_fragment:TA,clipping_planes_pars_vertex:wA,clipping_planes_vertex:bA,color_fragment:RA,color_pars_fragment:BA,color_pars_vertex:DA,color_vertex:FA,common:LA,cube_uv_reflection_fragment:PA,defaultnormal_vertex:UA,displacementmap_pars_vertex:NA,displacementmap_vertex:OA,emissivemap_fragment:QA,emissivemap_pars_fragment:kA,colorspace_fragment:GA,colorspace_pars_fragment:HA,envmap_fragment:VA,envmap_common_pars_fragment:zA,envmap_pars_fragment:WA,envmap_pars_vertex:KA,envmap_physical_pars_fragment:im,envmap_vertex:XA,fog_vertex:qA,fog_pars_vertex:YA,fog_fragment:JA,fog_pars_fragment:ZA,gradientmap_pars_fragment:jA,lightmap_pars_fragment:$A,lights_lambert_fragment:em,lights_lambert_pars_fragment:tm,lights_pars_begin:nm,lights_toon_fragment:sm,lights_toon_pars_fragment:rm,lights_phong_fragment:om,lights_phong_pars_fragment:am,lights_physical_fragment:cm,lights_physical_pars_fragment:lm,lights_fragment_begin:hm,lights_fragment_maps:um,lights_fragment_end:dm,logdepthbuf_fragment:fm,logdepthbuf_pars_fragment:pm,logdepthbuf_pars_vertex:Am,logdepthbuf_vertex:mm,map_fragment:gm,map_pars_fragment:_m,map_particle_fragment:ym,map_particle_pars_fragment:Em,metalnessmap_fragment:xm,metalnessmap_pars_fragment:vm,morphinstance_vertex:Mm,morphcolor_vertex:Cm,morphnormal_vertex:Sm,morphtarget_pars_vertex:Im,morphtarget_vertex:Tm,normal_fragment_begin:wm,normal_fragment_maps:bm,normal_pars_fragment:Rm,normal_pars_vertex:Bm,normal_vertex:Dm,normalmap_pars_fragment:Fm,clearcoat_normal_fragment_begin:Lm,clearcoat_normal_fragment_maps:Pm,clearcoat_pars_fragment:Um,iridescence_pars_fragment:Nm,opaque_fragment:Om,packing:Qm,premultiplied_alpha_fragment:km,project_vertex:Gm,dithering_fragment:Hm,dithering_pars_fragment:Vm,roughnessmap_fragment:zm,roughnessmap_pars_fragment:Wm,shadowmap_pars_fragment:Km,shadowmap_pars_vertex:Xm,shadowmap_vertex:qm,shadowmask_pars_fragment:Ym,skinbase_vertex:Jm,skinning_pars_vertex:Zm,skinning_vertex:jm,skinnormal_vertex:$m,specularmap_fragment:eg,specularmap_pars_fragment:tg,tonemapping_fragment:ng,tonemapping_pars_fragment:ig,transmission_fragment:sg,transmission_pars_fragment:rg,uv_pars_fragment:og,uv_pars_vertex:ag,uv_vertex:cg,worldpos_vertex:lg,background_vert:hg,background_frag:ug,backgroundCube_vert:dg,backgroundCube_frag:fg,cube_vert:pg,cube_frag:Ag,depth_vert:mg,depth_frag:gg,distanceRGBA_vert:_g,distanceRGBA_frag:yg,equirect_vert:Eg,equirect_frag:xg,linedashed_vert:vg,linedashed_frag:Mg,meshbasic_vert:Cg,meshbasic_frag:Sg,meshlambert_vert:Ig,meshlambert_frag:Tg,meshmatcap_vert:wg,meshmatcap_frag:bg,meshnormal_vert:Rg,meshnormal_frag:Bg,meshphong_vert:Dg,meshphong_frag:Fg,meshphysical_vert:Lg,meshphysical_frag:Pg,meshtoon_vert:Ug,meshtoon_frag:Ng,points_vert:Og,points_frag:Qg,shadow_vert:kg,shadow_frag:Gg,sprite_vert:Hg,sprite_frag:Vg},oe={common:{diffuse:{value:new fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Pe},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Pe}},envmap:{envMap:{value:null},envMapRotation:{value:new Pe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Pe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Pe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Pe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Pe},normalScale:{value:new Se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Pe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Pe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Pe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Pe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0},uvTransform:{value:new Pe}},sprite:{diffuse:{value:new fe(16777215)},opacity:{value:1},center:{value:new Se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Pe},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0}}},Yn={basic:{uniforms:qt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:qt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new fe(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:qt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new fe(0)},specular:{value:new fe(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:qt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:qt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new fe(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:qt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:qt([oe.points,oe.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:qt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:qt([oe.common,oe.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:qt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:qt([oe.sprite,oe.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Pe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Pe}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:qt([oe.common,oe.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:qt([oe.lights,oe.fog,{color:{value:new fe(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};Yn.physical={uniforms:qt([Yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Pe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Pe},clearcoatNormalScale:{value:new Se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Pe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Pe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Pe},sheen:{value:0},sheenColor:{value:new fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Pe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Pe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Pe},transmissionSamplerSize:{value:new Se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Pe},attenuationDistance:{value:0},attenuationColor:{value:new fe(0)},specularColor:{value:new fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Pe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Pe},anisotropyVector:{value:new Se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Pe}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};var Ba={r:0,b:0,g:0},As=new Ln,zg=new Oe;function Wg(s,e,t,n,i,r,o){let a=new fe(0),l=r===!0?0:1,c,h,d=null,f=0,u=null;function p(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?t:e).get(y)),y}function g(v){let y=!1,I=p(v);I===null?A(a,l):I&&I.isColor&&(A(I,1),y=!0);let T=s.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(v,y){let I=p(y);I&&(I.isCubeTexture||I.mapping===ro)?(h===void 0&&(h=new At(new Di(1,1,1),new ht({name:"BackgroundCubeMaterial",uniforms:ps(Yn.backgroundCube.uniforms),vertexShader:Yn.backgroundCube.vertexShader,fragmentShader:Yn.backgroundCube.fragmentShader,side:Pt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,R,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),As.copy(y.backgroundRotation),As.x*=-1,As.y*=-1,As.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(As.y*=-1,As.z*=-1),h.material.uniforms.envMap.value=I,h.material.uniforms.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(zg.makeRotationFromEuler(As)),h.material.toneMapped=We.getTransfer(I.colorSpace)!==it,(d!==I||f!==I.version||u!==s.toneMapping)&&(h.material.needsUpdate=!0,d=I,f=I.version,u=s.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):I&&I.isTexture&&(c===void 0&&(c=new At(new Ni(2,2),new ht({name:"BackgroundMaterial",uniforms:ps(Yn.background.uniforms),vertexShader:Yn.background.vertexShader,fragmentShader:Yn.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=I,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=We.getTransfer(I.colorSpace)!==it,I.matrixAutoUpdate===!0&&I.updateMatrix(),c.material.uniforms.uvTransform.value.copy(I.matrix),(d!==I||f!==I.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,d=I,f=I.version,u=s.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function A(v,y){v.getRGB(Ba,$c(s)),n.buffers.color.setClear(Ba.r,Ba.g,Ba.b,y,o)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,y=1){a.set(v),l=y,A(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,A(a,l)},render:g,addToRenderList:m,dispose:x}}function Kg(s,e){let t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null),r=i,o=!1;function a(M,B,U,k,H){let K=!1,V=d(k,U,B);r!==V&&(r=V,c(r.object)),K=u(M,k,U,H),K&&p(M,k,U,H),H!==null&&e.update(H,s.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,y(M,B,U,k),H!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return s.createVertexArray()}function c(M){return s.bindVertexArray(M)}function h(M){return s.deleteVertexArray(M)}function d(M,B,U){let k=U.wireframe===!0,H=n[M.id];H===void 0&&(H={},n[M.id]=H);let K=H[B.id];K===void 0&&(K={},H[B.id]=K);let V=K[k];return V===void 0&&(V=f(l()),K[k]=V),V}function f(M){let B=[],U=[],k=[];for(let H=0;H<t;H++)B[H]=0,U[H]=0,k[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:U,attributeDivisors:k,object:M,attributes:{},index:null}}function u(M,B,U,k){let H=r.attributes,K=B.attributes,V=0,$=U.getAttributes();for(let G in $)if($[G].location>=0){let le=H[G],re=K[G];if(re===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(re=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(re=M.instanceColor)),le===void 0||le.attribute!==re||re&&le.data!==re.data)return!0;V++}return r.attributesNum!==V||r.index!==k}function p(M,B,U,k){let H={},K=B.attributes,V=0,$=U.getAttributes();for(let G in $)if($[G].location>=0){let le=K[G];le===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(le=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(le=M.instanceColor));let re={};re.attribute=le,le&&le.data&&(re.data=le.data),H[G]=re,V++}r.attributes=H,r.attributesNum=V,r.index=k}function g(){let M=r.newAttributes;for(let B=0,U=M.length;B<U;B++)M[B]=0}function m(M){A(M,0)}function A(M,B){let U=r.newAttributes,k=r.enabledAttributes,H=r.attributeDivisors;U[M]=1,k[M]===0&&(s.enableVertexAttribArray(M),k[M]=1),H[M]!==B&&(s.vertexAttribDivisor(M,B),H[M]=B)}function x(){let M=r.newAttributes,B=r.enabledAttributes;for(let U=0,k=B.length;U<k;U++)B[U]!==M[U]&&(s.disableVertexAttribArray(U),B[U]=0)}function v(M,B,U,k,H,K,V){V===!0?s.vertexAttribIPointer(M,B,U,H,K):s.vertexAttribPointer(M,B,U,k,H,K)}function y(M,B,U,k){g();let H=k.attributes,K=U.getAttributes(),V=B.defaultAttributeValues;for(let $ in K){let G=K[$];if(G.location>=0){let ie=H[$];if(ie===void 0&&($==="instanceMatrix"&&M.instanceMatrix&&(ie=M.instanceMatrix),$==="instanceColor"&&M.instanceColor&&(ie=M.instanceColor)),ie!==void 0){let le=ie.normalized,re=ie.itemSize,ye=e.get(ie);if(ye===void 0)continue;let ze=ye.buffer,st=ye.type,et=ye.bytesPerElement,X=st===s.INT||st===s.UNSIGNED_INT||ie.gpuType===ua;if(ie.isInterleavedBufferAttribute){let J=ie.data,pe=J.stride,De=ie.offset;if(J.isInstancedInterleavedBuffer){for(let Ce=0;Ce<G.locationSize;Ce++)A(G.location+Ce,J.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Ce=0;Ce<G.locationSize;Ce++)m(G.location+Ce);s.bindBuffer(s.ARRAY_BUFFER,ze);for(let Ce=0;Ce<G.locationSize;Ce++)v(G.location+Ce,re/G.locationSize,st,le,pe*et,(De+re/G.locationSize*Ce)*et,X)}else{if(ie.isInstancedBufferAttribute){for(let J=0;J<G.locationSize;J++)A(G.location+J,ie.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let J=0;J<G.locationSize;J++)m(G.location+J);s.bindBuffer(s.ARRAY_BUFFER,ze);for(let J=0;J<G.locationSize;J++)v(G.location+J,re/G.locationSize,st,le,re*et,re/G.locationSize*J*et,X)}}else if(V!==void 0){let le=V[$];if(le!==void 0)switch(le.length){case 2:s.vertexAttrib2fv(G.location,le);break;case 3:s.vertexAttrib3fv(G.location,le);break;case 4:s.vertexAttrib4fv(G.location,le);break;default:s.vertexAttrib1fv(G.location,le)}}}}x()}function I(){F();for(let M in n){let B=n[M];for(let U in B){let k=B[U];for(let H in k)h(k[H].object),delete k[H];delete B[U]}delete n[M]}}function T(M){if(n[M.id]===void 0)return;let B=n[M.id];for(let U in B){let k=B[U];for(let H in k)h(k[H].object),delete k[H];delete B[U]}delete n[M.id]}function R(M){for(let B in n){let U=n[B];if(U[M.id]===void 0)continue;let k=U[M.id];for(let H in k)h(k[H].object),delete k[H];delete U[M.id]}}function F(){C(),o=!0,r!==i&&(r=i,c(r.object))}function C(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:F,resetDefaultState:C,dispose:I,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:g,enableAttribute:m,disableUnusedAttributes:x}}function Xg(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,d){d!==0&&(s.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function a(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let u=0;for(let p=0;p<d;p++)u+=h[p];t.update(u,n,1)}function l(c,h,d,f){if(d===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let p=0;p<c.length;p++)o(c[p],h[p],f[p]);else{u.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g]*f[g];t.update(p,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function qg(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(R){return!(R!==Tt&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let F=R===Xt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Ue&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Ut&&!F)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),A=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),v=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),I=p>0,T=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:u,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:A,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:I,maxSamples:T}}function Yg(s){let e=this,t=null,n=0,i=!1,r=!1,o=new yn,a=new Pe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let u=d.length!==0||f||n!==0||i;return i=f,n=d.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=h(d,f,0)},this.setState=function(d,f,u){let p=d.clippingPlanes,g=d.clipIntersection,m=d.clipShadows,A=s.get(d);if(!i||p===null||p.length===0||r&&!m)r?h(null):c();else{let x=r?0:n,v=x*4,y=A.clippingState||null;l.value=y,y=h(p,f,v,u);for(let I=0;I!==v;++I)y[I]=t[I];A.clippingState=y,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,f,u,p){let g=d!==null?d.length:0,m=null;if(g!==0){if(m=l.value,p!==!0||m===null){let A=u+g*4,x=f.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<A)&&(m=new Float32Array(A));for(let v=0,y=u;v!==g;++v,y+=4)o.copy(d[v]).applyMatrix4(x,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}function Jg(s){let e=new WeakMap;function t(o,a){return a===$s?o.mapping=Qi:a===ha&&(o.mapping=as),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===$s||a===ha)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new zo(l.height);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var mr=4,ju=[.125,.215,.35,.446,.526,.582],_s=20,il=new fi,$u=new fe,sl=null,rl=0,ol=0,al=!1,gs=(1+Math.sqrt(5))/2,Ar=1/gs,ed=[new w(-gs,Ar,0),new w(gs,Ar,0),new w(-Ar,0,gs),new w(Ar,0,gs),new w(0,gs,-Ar),new w(0,gs,Ar),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)],Zg=new w,_r=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,r={}){let{size:o=256,position:a=Zg}=r;sl=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),ol=this._renderer.getActiveMipmapLevel(),al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=id(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(sl,rl,ol),this._renderer.xr.enabled=al,e.scissorTest=!1,Da(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Qi||e.mapping===as?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),sl=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),ol=this._renderer.getActiveMipmapLevel(),al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Et,minFilter:Et,generateMipmaps:!1,type:Xt,format:Tt,colorSpace:wt,depthBuffer:!1},i=td(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=td(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=jg(r)),this._blurMaterial=$g(r,e,t)}return i}_compileMaterial(e){let t=new At(this._lodPlanes[0],e);this._renderer.compile(t,il)}_sceneToCubeUV(e,t,n,i,r){let l=new Ct(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,u=d.toneMapping;d.getClearColor($u),d.toneMapping=mi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null));let g=new Ot({name:"PMREM.Background",side:Pt,depthWrite:!1,depthTest:!1}),m=new At(new Di,g),A=!1,x=e.background;x?x.isColor&&(g.color.copy(x),e.background=null,A=!0):(g.color.copy($u),A=!0);for(let v=0;v<6;v++){let y=v%3;y===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[v],r.y,r.z)):y===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[v]));let I=this._cubeSize;Da(i,y*I,v>2?I:0,I,I),d.setRenderTarget(i),A&&d.render(m,l),d.render(e,l)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=u,d.autoClear=f,e.background=x}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Qi||e.mapping===as;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=id()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nd());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new At(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Da(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,il)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=ed[(i-r-1)%ed.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new At(this._lodPlanes[i],c),f=c.uniforms,u=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*_s-1),g=r/p,m=isFinite(r)?1+Math.floor(h*g):_s;m>_s&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_s}`);let A=[],x=0;for(let R=0;R<_s;++R){let F=R/g,C=Math.exp(-F*F/2);A.push(C),R===0?x+=C:R<m&&(x+=2*C)}for(let R=0;R<A.length;R++)A[R]=A[R]/x;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=A,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:v}=this;f.dTheta.value=p,f.mipInt.value=v-n;let y=this._sizeLods[i],I=3*y*(i>v-mr?i-v+mr:0),T=4*(this._cubeSize-y);Da(t,I,T,3*y,2*y),l.setRenderTarget(t),l.render(d,il)}};function jg(s){let e=[],t=[],n=[],i=s,r=s-mr+1+ju.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);t.push(a);let l=1/a;o>s-mr?l=ju[o-s+mr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],u=6,p=6,g=3,m=2,A=1,x=new Float32Array(g*p*u),v=new Float32Array(m*p*u),y=new Float32Array(A*p*u);for(let T=0;T<u;T++){let R=T%3*2/3-1,F=T>2?0:-1,C=[R,F,0,R+2/3,F,0,R+2/3,F+1,0,R,F,0,R+2/3,F+1,0,R,F+1,0];x.set(C,g*p*T),v.set(f,m*p*T);let M=[T,T,T,T,T,T];y.set(M,A*p*T)}let I=new Je;I.setAttribute("position",new Ge(x,g)),I.setAttribute("uv",new Ge(v,m)),I.setAttribute("faceIndex",new Ge(y,A)),e.push(I),i>mr&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function td(s,e,t){let n=new fn(s,e,t);return n.texture.mapping=ro,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Da(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function $g(s,e,t){let n=new Float32Array(_s),i=new w(0,1,0);return new ht({name:"SphericalGaussianBlur",defines:{n:_s,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:gl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function nd(){return new ht({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function id(){return new ht({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function gl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function e_(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===$s||l===ha,h=l===Qi||l===as;if(c||h){let d=e.get(a),f=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new _r(s)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{let u=a.image;return c&&u&&u.height>0||h&&u&&i(u)?(t===null&&(t=new _r(s)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function i(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function t_(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&Gs("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function n_(s,e,t,n){let i={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&e.remove(f.index);for(let p in f.attributes)e.remove(f.attributes[p]);f.removeEventListener("dispose",o),delete i[f.id];let u=r.get(f);u&&(e.remove(u),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(d,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,t.memory.geometries++),f}function l(d){let f=d.attributes;for(let u in f)e.update(f[u],s.ARRAY_BUFFER)}function c(d){let f=[],u=d.index,p=d.attributes.position,g=0;if(u!==null){let x=u.array;g=u.version;for(let v=0,y=x.length;v<y;v+=3){let I=x[v+0],T=x[v+1],R=x[v+2];f.push(I,T,T,R,R,I)}}else if(p!==void 0){let x=p.array;g=p.version;for(let v=0,y=x.length/3-1;v<y;v+=3){let I=v+0,T=v+1,R=v+2;f.push(I,T,T,R,R,I)}}else return;let m=new(jc(f)?Or:Nr)(f,1);m.version=g;let A=r.get(d);A&&e.remove(A),r.set(d,m)}function h(d){let f=r.get(d);if(f){let u=d.index;u!==null&&f.version<u.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function i_(s,e,t){let n;function i(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,u){s.drawElements(n,u,r,f*o),t.update(u,n,1)}function c(f,u,p){p!==0&&(s.drawElementsInstanced(n,u,r,f*o,p),t.update(u,n,p))}function h(f,u,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,p);let m=0;for(let A=0;A<p;A++)m+=u[A];t.update(m,n,1)}function d(f,u,p,g){if(p===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let A=0;A<f.length;A++)c(f[A]/o,u[A],g[A]);else{m.multiDrawElementsInstancedWEBGL(n,u,0,r,f,0,g,0,p);let A=0;for(let x=0;x<p;x++)A+=u[x]*g[x];t.update(A,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function s_(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function r_(s,e,t){let n=new WeakMap,i=new $e;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==d){let C=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",C)};f!==void 0&&f.texture.dispose();let u=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],A=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],v=0;u===!0&&(v=1),p===!0&&(v=2),g===!0&&(v=3);let y=a.attributes.position.count*v,I=1;y>e.maxTextureSize&&(I=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let T=new Float32Array(y*I*4*d),R=new Ur(T,y,I,d);R.type=Ut,R.needsUpdate=!0;let F=v*4;for(let M=0;M<d;M++){let B=m[M],U=A[M],k=x[M],H=y*I*4*M;for(let K=0;K<B.count;K++){let V=K*F;u===!0&&(i.fromBufferAttribute(B,K),T[H+V+0]=i.x,T[H+V+1]=i.y,T[H+V+2]=i.z,T[H+V+3]=0),p===!0&&(i.fromBufferAttribute(U,K),T[H+V+4]=i.x,T[H+V+5]=i.y,T[H+V+6]=i.z,T[H+V+7]=0),g===!0&&(i.fromBufferAttribute(k,K),T[H+V+8]=i.x,T[H+V+9]=i.y,T[H+V+10]=i.z,T[H+V+11]=k.itemSize===4?i.w:1)}}f={count:d,texture:R,size:new Se(y,I)},n.set(a,f),a.addEventListener("dispose",C)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let u=0;for(let g=0;g<c.length;g++)u+=c[g];let p=a.morphTargetsRelative?1:1-u;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function o_(s,e,t,n){let i=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,d=e.get(l,h);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return d}function o(){i=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var vd=new It,sd=new Xr(1,1),Md=new Ur,Cd=new Vs,Sd=new kr,rd=[],od=[],ad=new Float32Array(16),cd=new Float32Array(9),ld=new Float32Array(4);function yr(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=rd[i];if(r===void 0&&(r=new Float32Array(i),rd[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function Rt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Bt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Pa(s,e){let t=od[e];t===void 0&&(t=new Int32Array(e),od[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function a_(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function c_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2fv(this.addr,e),Bt(t,e)}}function l_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Rt(t,e))return;s.uniform3fv(this.addr,e),Bt(t,e)}}function h_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4fv(this.addr,e),Bt(t,e)}}function u_(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Bt(t,e)}else{if(Rt(t,n))return;ld.set(n),s.uniformMatrix2fv(this.addr,!1,ld),Bt(t,n)}}function d_(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Bt(t,e)}else{if(Rt(t,n))return;cd.set(n),s.uniformMatrix3fv(this.addr,!1,cd),Bt(t,n)}}function f_(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Bt(t,e)}else{if(Rt(t,n))return;ad.set(n),s.uniformMatrix4fv(this.addr,!1,ad),Bt(t,n)}}function p_(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function A_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2iv(this.addr,e),Bt(t,e)}}function m_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;s.uniform3iv(this.addr,e),Bt(t,e)}}function g_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4iv(this.addr,e),Bt(t,e)}}function __(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function y_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2uiv(this.addr,e),Bt(t,e)}}function E_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;s.uniform3uiv(this.addr,e),Bt(t,e)}}function x_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4uiv(this.addr,e),Bt(t,e)}}function v_(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(sd.compareFunction=Yc,r=sd):r=vd,t.setTexture2D(e||r,i)}function M_(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Cd,i)}function C_(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Sd,i)}function S_(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Md,i)}function I_(s){switch(s){case 5126:return a_;case 35664:return c_;case 35665:return l_;case 35666:return h_;case 35674:return u_;case 35675:return d_;case 35676:return f_;case 5124:case 35670:return p_;case 35667:case 35671:return A_;case 35668:case 35672:return m_;case 35669:case 35673:return g_;case 5125:return __;case 36294:return y_;case 36295:return E_;case 36296:return x_;case 35678:case 36198:case 36298:case 36306:case 35682:return v_;case 35679:case 36299:case 36307:return M_;case 35680:case 36300:case 36308:case 36293:return C_;case 36289:case 36303:case 36311:case 36292:return S_}}function T_(s,e){s.uniform1fv(this.addr,e)}function w_(s,e){let t=yr(e,this.size,2);s.uniform2fv(this.addr,t)}function b_(s,e){let t=yr(e,this.size,3);s.uniform3fv(this.addr,t)}function R_(s,e){let t=yr(e,this.size,4);s.uniform4fv(this.addr,t)}function B_(s,e){let t=yr(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function D_(s,e){let t=yr(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function F_(s,e){let t=yr(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function L_(s,e){s.uniform1iv(this.addr,e)}function P_(s,e){s.uniform2iv(this.addr,e)}function U_(s,e){s.uniform3iv(this.addr,e)}function N_(s,e){s.uniform4iv(this.addr,e)}function O_(s,e){s.uniform1uiv(this.addr,e)}function Q_(s,e){s.uniform2uiv(this.addr,e)}function k_(s,e){s.uniform3uiv(this.addr,e)}function G_(s,e){s.uniform4uiv(this.addr,e)}function H_(s,e,t){let n=this.cache,i=e.length,r=Pa(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Bt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||vd,r[o])}function V_(s,e,t){let n=this.cache,i=e.length,r=Pa(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Bt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Cd,r[o])}function z_(s,e,t){let n=this.cache,i=e.length,r=Pa(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Bt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Sd,r[o])}function W_(s,e,t){let n=this.cache,i=e.length,r=Pa(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Bt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Md,r[o])}function K_(s){switch(s){case 5126:return T_;case 35664:return w_;case 35665:return b_;case 35666:return R_;case 35674:return B_;case 35675:return D_;case 35676:return F_;case 5124:case 35670:return L_;case 35667:case 35671:return P_;case 35668:case 35672:return U_;case 35669:case 35673:return N_;case 5125:return O_;case 36294:return Q_;case 36295:return k_;case 36296:return G_;case 35678:case 36198:case 36298:case 36306:case 35682:return H_;case 35679:case 36299:case 36307:return V_;case 35680:case 36300:case 36308:case 36293:return z_;case 36289:case 36303:case 36311:case 36292:return W_}}var ll=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=I_(t.type)}},hl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=K_(t.type)}},ul=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(e,t[a.id],n)}}},cl=/(\w+)(\])?(\[|\.)?/g;function hd(s,e){s.seq.push(e),s.map[e.id]=e}function X_(s,e,t){let n=s.name,i=n.length;for(cl.lastIndex=0;;){let r=cl.exec(n),o=cl.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){hd(t,c===void 0?new ll(a,s,e):new hl(a,s,e));break}else{let d=t.map[a];d===void 0&&(d=new ul(a),hd(t,d)),t=d}}}var gr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);X_(r,o,this)}}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let o=e[i];o.id in t&&n.push(o)}return n}};function ud(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}var q_=37297,Y_=0;function J_(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var dd=new Pe;function Z_(s){We._getMatrix(dd,We.workingColorSpace,s);let e=`mat3( ${dd.elements.map(t=>t.toFixed(4))} )`;switch(We.getTransfer(s)){case Qs:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function fd(s,e,t){let n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+J_(s.getShaderSource(e),a)}else return r}function j_(s,e){let t=Z_(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function $_(s,e){let t;switch(e){case wu:t="Linear";break;case bu:t="Reinhard";break;case Ru:t="Cineon";break;case la:t="ACESFilmic";break;case Du:t="AgX";break;case Fu:t="Neutral";break;case Bu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Fa=new w;function e0(){We.getLuminanceCoefficients(Fa);let s=Fa.x.toFixed(4),e=Fa.y.toFixed(4),t=Fa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function t0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ao).join(`
`)}function n0(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function i0(s,e){let t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function ao(s){return s!==""}function pd(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ad(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var s0=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(s){return s.replace(s0,o0)}var r0=new Map;function o0(s,e){let t=He[e];if(t===void 0){let n=r0.get(e);if(n!==void 0)t=He[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return dl(t)}var a0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function md(s){return s.replace(a0,c0)}function c0(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function gd(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function l0(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Qc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===ta?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Kn&&(e="SHADOWMAP_TYPE_VSM"),e}function h0(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Qi:case as:e="ENVMAP_TYPE_CUBE";break;case ro:e="ENVMAP_TYPE_CUBE_UV";break}return e}function u0(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case as:e="ENVMAP_MODE_REFRACTION";break}return e}function d0(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Hc:e="ENVMAP_BLENDING_MULTIPLY";break;case Iu:e="ENVMAP_BLENDING_MIX";break;case Tu:e="ENVMAP_BLENDING_ADD";break}return e}function f0(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function p0(s,e,t,n){let i=s.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=l0(t),c=h0(t),h=u0(t),d=d0(t),f=f0(t),u=t0(t),p=n0(r),g=i.createProgram(),m,A,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ao).join(`
`),m.length>0&&(m+=`
`),A=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ao).join(`
`),A.length>0&&(A+=`
`)):(m=[gd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ao).join(`
`),A=[gd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==mi?"#define TONE_MAPPING":"",t.toneMapping!==mi?He.tonemapping_pars_fragment:"",t.toneMapping!==mi?$_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,j_("linearToOutputTexel",t.outputColorSpace),e0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ao).join(`
`)),o=dl(o),o=pd(o,t),o=Ad(o,t),a=dl(a),a=pd(a,t),a=Ad(a,t),o=md(o),a=md(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,A=["#define varying in",t.glslVersion===Jc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Jc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+A);let v=x+m+o,y=x+A+a,I=ud(i,i.VERTEX_SHADER,v),T=ud(i,i.FRAGMENT_SHADER,y);i.attachShader(g,I),i.attachShader(g,T),t.index0AttributeName!==void 0?i.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function R(B){if(s.debug.checkShaderErrors){let U=i.getProgramInfoLog(g)||"",k=i.getShaderInfoLog(I)||"",H=i.getShaderInfoLog(T)||"",K=U.trim(),V=k.trim(),$=H.trim(),G=!0,ie=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(G=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,I,T);else{let le=fd(i,I,"vertex"),re=fd(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+K+`
`+le+`
`+re)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):(V===""||$==="")&&(ie=!1);ie&&(B.diagnostics={runnable:G,programLog:K,vertexShader:{log:V,prefix:m},fragmentShader:{log:$,prefix:A}})}i.deleteShader(I),i.deleteShader(T),F=new gr(i,g),C=i0(i,g)}let F;this.getUniforms=function(){return F===void 0&&R(this),F};let C;this.getAttributes=function(){return C===void 0&&R(this),C};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=i.getProgramParameter(g,q_)),M},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Y_++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=I,this.fragmentShader=T,this}var A0=0,fl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new pl(e),t.set(e,n)),n}},pl=class{constructor(e){this.id=A0++,this.code=e,this.usedTimes=0}};function m0(s,e,t,n,i,r,o){let a=new zs,l=new fl,c=new Set,h=[],d=i.logarithmicDepthBuffer,f=i.vertexTextures,u=i.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(C){return c.add(C),C===0?"uv":`uv${C}`}function m(C,M,B,U,k){let H=U.fog,K=k.geometry,V=C.isMeshStandardMaterial?U.environment:null,$=(C.isMeshStandardMaterial?t:e).get(C.envMap||V),G=$&&$.mapping===ro?$.image.height:null,ie=p[C.type];C.precision!==null&&(u=i.getMaxPrecision(C.precision),u!==C.precision&&console.warn("THREE.WebGLProgram.getParameters:",C.precision,"not supported, using",u,"instead."));let le=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,re=le!==void 0?le.length:0,ye=0;K.morphAttributes.position!==void 0&&(ye=1),K.morphAttributes.normal!==void 0&&(ye=2),K.morphAttributes.color!==void 0&&(ye=3);let ze,st,et,X;if(ie){let tt=Yn[ie];ze=tt.vertexShader,st=tt.fragmentShader}else ze=C.vertexShader,st=C.fragmentShader,l.update(C),et=l.getVertexShaderID(C),X=l.getFragmentShaderID(C);let J=s.getRenderTarget(),pe=s.state.buffers.depth.getReversed(),De=k.isInstancedMesh===!0,Ce=k.isBatchedMesh===!0,Ye=!!C.map,Gt=!!C.matcap,b=!!$,ft=!!C.aoMap,Ne=!!C.lightMap,Re=!!C.bumpMap,ge=!!C.normalMap,pt=!!C.displacementMap,_e=!!C.emissiveMap,ke=!!C.metalnessMap,Ft=!!C.roughnessMap,vt=C.anisotropy>0,S=C.clearcoat>0,_=C.dispersion>0,N=C.iridescence>0,W=C.sheen>0,Y=C.transmission>0,z=vt&&!!C.anisotropyMap,Me=S&&!!C.clearcoatMap,ne=S&&!!C.clearcoatNormalMap,Ee=S&&!!C.clearcoatRoughnessMap,xe=N&&!!C.iridescenceMap,ee=N&&!!C.iridescenceThicknessMap,he=W&&!!C.sheenColorMap,be=W&&!!C.sheenRoughnessMap,ve=!!C.specularMap,ae=!!C.specularColorMap,Qe=!!C.specularIntensityMap,D=Y&&!!C.transmissionMap,te=Y&&!!C.thicknessMap,se=!!C.gradientMap,de=!!C.alphaMap,Z=C.alphaTest>0,q=!!C.alphaHash,me=!!C.extensions,Le=mi;C.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Le=s.toneMapping);let ut={shaderID:ie,shaderType:C.type,shaderName:C.name,vertexShader:ze,fragmentShader:st,defines:C.defines,customVertexShaderID:et,customFragmentShaderID:X,isRawShaderMaterial:C.isRawShaderMaterial===!0,glslVersion:C.glslVersion,precision:u,batching:Ce,batchingColor:Ce&&k._colorsTexture!==null,instancing:De,instancingColor:De&&k.instanceColor!==null,instancingMorph:De&&k.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:J===null?s.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:wt,alphaToCoverage:!!C.alphaToCoverage,map:Ye,matcap:Gt,envMap:b,envMapMode:b&&$.mapping,envMapCubeUVHeight:G,aoMap:ft,lightMap:Ne,bumpMap:Re,normalMap:ge,displacementMap:f&&pt,emissiveMap:_e,normalMapObjectSpace:ge&&C.normalMapType===Ou,normalMapTangentSpace:ge&&C.normalMapType===qc,metalnessMap:ke,roughnessMap:Ft,anisotropy:vt,anisotropyMap:z,clearcoat:S,clearcoatMap:Me,clearcoatNormalMap:ne,clearcoatRoughnessMap:Ee,dispersion:_,iridescence:N,iridescenceMap:xe,iridescenceThicknessMap:ee,sheen:W,sheenColorMap:he,sheenRoughnessMap:be,specularMap:ve,specularColorMap:ae,specularIntensityMap:Qe,transmission:Y,transmissionMap:D,thicknessMap:te,gradientMap:se,opaque:C.transparent===!1&&C.blending===oi&&C.alphaToCoverage===!1,alphaMap:de,alphaTest:Z,alphaHash:q,combine:C.combine,mapUv:Ye&&g(C.map.channel),aoMapUv:ft&&g(C.aoMap.channel),lightMapUv:Ne&&g(C.lightMap.channel),bumpMapUv:Re&&g(C.bumpMap.channel),normalMapUv:ge&&g(C.normalMap.channel),displacementMapUv:pt&&g(C.displacementMap.channel),emissiveMapUv:_e&&g(C.emissiveMap.channel),metalnessMapUv:ke&&g(C.metalnessMap.channel),roughnessMapUv:Ft&&g(C.roughnessMap.channel),anisotropyMapUv:z&&g(C.anisotropyMap.channel),clearcoatMapUv:Me&&g(C.clearcoatMap.channel),clearcoatNormalMapUv:ne&&g(C.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ee&&g(C.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&g(C.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&g(C.iridescenceThicknessMap.channel),sheenColorMapUv:he&&g(C.sheenColorMap.channel),sheenRoughnessMapUv:be&&g(C.sheenRoughnessMap.channel),specularMapUv:ve&&g(C.specularMap.channel),specularColorMapUv:ae&&g(C.specularColorMap.channel),specularIntensityMapUv:Qe&&g(C.specularIntensityMap.channel),transmissionMapUv:D&&g(C.transmissionMap.channel),thicknessMapUv:te&&g(C.thicknessMap.channel),alphaMapUv:de&&g(C.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(ge||vt),vertexColors:C.vertexColors,vertexAlphas:C.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!K.attributes.uv&&(Ye||de),fog:!!H,useFog:C.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:C.flatShading===!0&&C.wireframe===!1,sizeAttenuation:C.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:pe,skinning:k.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:ye,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:C.dithering,shadowMapEnabled:s.shadowMap.enabled&&B.length>0,shadowMapType:s.shadowMap.type,toneMapping:Le,decodeVideoTexture:Ye&&C.map.isVideoTexture===!0&&We.getTransfer(C.map.colorSpace)===it,decodeVideoTextureEmissive:_e&&C.emissiveMap.isVideoTexture===!0&&We.getTransfer(C.emissiveMap.colorSpace)===it,premultipliedAlpha:C.premultipliedAlpha,doubleSided:C.side===on,flipSided:C.side===Pt,useDepthPacking:C.depthPacking>=0,depthPacking:C.depthPacking||0,index0AttributeName:C.index0AttributeName,extensionClipCullDistance:me&&C.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&C.extensions.multiDraw===!0||Ce)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:C.customProgramCacheKey()};return ut.vertexUv1s=c.has(1),ut.vertexUv2s=c.has(2),ut.vertexUv3s=c.has(3),c.clear(),ut}function A(C){let M=[];if(C.shaderID?M.push(C.shaderID):(M.push(C.customVertexShaderID),M.push(C.customFragmentShaderID)),C.defines!==void 0)for(let B in C.defines)M.push(B),M.push(C.defines[B]);return C.isRawShaderMaterial===!1&&(x(M,C),v(M,C),M.push(s.outputColorSpace)),M.push(C.customProgramCacheKey),M.join()}function x(C,M){C.push(M.precision),C.push(M.outputColorSpace),C.push(M.envMapMode),C.push(M.envMapCubeUVHeight),C.push(M.mapUv),C.push(M.alphaMapUv),C.push(M.lightMapUv),C.push(M.aoMapUv),C.push(M.bumpMapUv),C.push(M.normalMapUv),C.push(M.displacementMapUv),C.push(M.emissiveMapUv),C.push(M.metalnessMapUv),C.push(M.roughnessMapUv),C.push(M.anisotropyMapUv),C.push(M.clearcoatMapUv),C.push(M.clearcoatNormalMapUv),C.push(M.clearcoatRoughnessMapUv),C.push(M.iridescenceMapUv),C.push(M.iridescenceThicknessMapUv),C.push(M.sheenColorMapUv),C.push(M.sheenRoughnessMapUv),C.push(M.specularMapUv),C.push(M.specularColorMapUv),C.push(M.specularIntensityMapUv),C.push(M.transmissionMapUv),C.push(M.thicknessMapUv),C.push(M.combine),C.push(M.fogExp2),C.push(M.sizeAttenuation),C.push(M.morphTargetsCount),C.push(M.morphAttributeCount),C.push(M.numDirLights),C.push(M.numPointLights),C.push(M.numSpotLights),C.push(M.numSpotLightMaps),C.push(M.numHemiLights),C.push(M.numRectAreaLights),C.push(M.numDirLightShadows),C.push(M.numPointLightShadows),C.push(M.numSpotLightShadows),C.push(M.numSpotLightShadowsWithMaps),C.push(M.numLightProbes),C.push(M.shadowMapType),C.push(M.toneMapping),C.push(M.numClippingPlanes),C.push(M.numClipIntersection),C.push(M.depthPacking)}function v(C,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),C.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),C.push(a.mask)}function y(C){let M=p[C.type],B;if(M){let U=Yn[M];B=Yu.clone(U.uniforms)}else B=C.uniforms;return B}function I(C,M){let B;for(let U=0,k=h.length;U<k;U++){let H=h[U];if(H.cacheKey===M){B=H,++B.usedTimes;break}}return B===void 0&&(B=new p0(s,M,C,r),h.push(B)),B}function T(C){if(--C.usedTimes===0){let M=h.indexOf(C);h[M]=h[h.length-1],h.pop(),C.destroy()}}function R(C){l.remove(C)}function F(){l.dispose()}return{getParameters:m,getProgramCacheKey:A,getUniforms:y,acquireProgram:I,releaseProgram:T,releaseShaderCache:R,programs:h,dispose:F}}function g0(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function _0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function _d(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function yd(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(d,f,u,p,g,m){let A=s[e];return A===void 0?(A={id:d.id,object:d,geometry:f,material:u,groupOrder:p,renderOrder:d.renderOrder,z:g,group:m},s[e]=A):(A.id=d.id,A.object=d,A.geometry=f,A.material=u,A.groupOrder=p,A.renderOrder=d.renderOrder,A.z=g,A.group=m),e++,A}function a(d,f,u,p,g,m){let A=o(d,f,u,p,g,m);u.transmission>0?n.push(A):u.transparent===!0?i.push(A):t.push(A)}function l(d,f,u,p,g,m){let A=o(d,f,u,p,g,m);u.transmission>0?n.unshift(A):u.transparent===!0?i.unshift(A):t.unshift(A)}function c(d,f){t.length>1&&t.sort(d||_0),n.length>1&&n.sort(f||_d),i.length>1&&i.sort(f||_d)}function h(){for(let d=e,f=s.length;d<f;d++){let u=s[d];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function y0(){let s=new WeakMap;function e(n,i){let r=s.get(n),o;return r===void 0?(o=new yd,s.set(n,[o])):i>=r.length?(o=new yd,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function E0(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new w,color:new fe};break;case"SpotLight":t={position:new w,direction:new w,color:new fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new w,color:new fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new w,skyColor:new fe,groundColor:new fe};break;case"RectAreaLight":t={color:new fe,position:new w,halfWidth:new w,halfHeight:new w};break}return s[e.id]=t,t}}}function x0(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}var v0=0;function M0(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function C0(s){let e=new E0,t=x0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new w);let i=new w,r=new Oe,o=new Oe;function a(c){let h=0,d=0,f=0;for(let C=0;C<9;C++)n.probe[C].set(0,0,0);let u=0,p=0,g=0,m=0,A=0,x=0,v=0,y=0,I=0,T=0,R=0;c.sort(M0);for(let C=0,M=c.length;C<M;C++){let B=c[C],U=B.color,k=B.intensity,H=B.distance,K=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)h+=U.r*k,d+=U.g*k,f+=U.b*k;else if(B.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(B.sh.coefficients[V],k);R++}else if(B.isDirectionalLight){let V=e.get(B);if(V.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){let $=B.shadow,G=t.get(B);G.shadowIntensity=$.intensity,G.shadowBias=$.bias,G.shadowNormalBias=$.normalBias,G.shadowRadius=$.radius,G.shadowMapSize=$.mapSize,n.directionalShadow[u]=G,n.directionalShadowMap[u]=K,n.directionalShadowMatrix[u]=B.shadow.matrix,x++}n.directional[u]=V,u++}else if(B.isSpotLight){let V=e.get(B);V.position.setFromMatrixPosition(B.matrixWorld),V.color.copy(U).multiplyScalar(k),V.distance=H,V.coneCos=Math.cos(B.angle),V.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),V.decay=B.decay,n.spot[g]=V;let $=B.shadow;if(B.map&&(n.spotLightMap[I]=B.map,I++,$.updateMatrices(B),B.castShadow&&T++),n.spotLightMatrix[g]=$.matrix,B.castShadow){let G=t.get(B);G.shadowIntensity=$.intensity,G.shadowBias=$.bias,G.shadowNormalBias=$.normalBias,G.shadowRadius=$.radius,G.shadowMapSize=$.mapSize,n.spotShadow[g]=G,n.spotShadowMap[g]=K,y++}g++}else if(B.isRectAreaLight){let V=e.get(B);V.color.copy(U).multiplyScalar(k),V.halfWidth.set(B.width*.5,0,0),V.halfHeight.set(0,B.height*.5,0),n.rectArea[m]=V,m++}else if(B.isPointLight){let V=e.get(B);if(V.color.copy(B.color).multiplyScalar(B.intensity),V.distance=B.distance,V.decay=B.decay,B.castShadow){let $=B.shadow,G=t.get(B);G.shadowIntensity=$.intensity,G.shadowBias=$.bias,G.shadowNormalBias=$.normalBias,G.shadowRadius=$.radius,G.shadowMapSize=$.mapSize,G.shadowCameraNear=$.camera.near,G.shadowCameraFar=$.camera.far,n.pointShadow[p]=G,n.pointShadowMap[p]=K,n.pointShadowMatrix[p]=B.shadow.matrix,v++}n.point[p]=V,p++}else if(B.isHemisphereLight){let V=e.get(B);V.skyColor.copy(B.color).multiplyScalar(k),V.groundColor.copy(B.groundColor).multiplyScalar(k),n.hemi[A]=V,A++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=oe.LTC_FLOAT_1,n.rectAreaLTC2=oe.LTC_FLOAT_2):(n.rectAreaLTC1=oe.LTC_HALF_1,n.rectAreaLTC2=oe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=f;let F=n.hash;(F.directionalLength!==u||F.pointLength!==p||F.spotLength!==g||F.rectAreaLength!==m||F.hemiLength!==A||F.numDirectionalShadows!==x||F.numPointShadows!==v||F.numSpotShadows!==y||F.numSpotMaps!==I||F.numLightProbes!==R)&&(n.directional.length=u,n.spot.length=g,n.rectArea.length=m,n.point.length=p,n.hemi.length=A,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+I-T,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,F.directionalLength=u,F.pointLength=p,F.spotLength=g,F.rectAreaLength=m,F.hemiLength=A,F.numDirectionalShadows=x,F.numPointShadows=v,F.numSpotShadows=y,F.numSpotMaps=I,F.numLightProbes=R,n.version=v0++)}function l(c,h){let d=0,f=0,u=0,p=0,g=0,m=h.matrixWorldInverse;for(let A=0,x=c.length;A<x;A++){let v=c[A];if(v.isDirectionalLight){let y=n.directional[d];y.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),d++}else if(v.isSpotLight){let y=n.spot[u];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),u++}else if(v.isRectAreaLight){let y=n.rectArea[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),p++}else if(v.isPointLight){let y=n.point[f];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){let y=n.hemi[g];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:n}}function Ed(s){let e=new C0(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function S0(s){let e=new WeakMap;function t(i,r=0){let o=e.get(i),a;return o===void 0?(a=new Ed(s),e.set(i,[a])):r>=o.length?(a=new Ed(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var I0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,T0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function w0(s,e,t){let n=new Ys,i=new Se,r=new Se,o=new $e,a=new Xo({depthPacking:Nu}),l=new qo,c={},h=t.maxTextureSize,d={[Fn]:Pt,[Pt]:Fn,[on]:on},f=new ht({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Se},radius:{value:4}},vertexShader:I0,fragmentShader:T0}),u=f.clone();u.defines.HORIZONTAL_PASS=1;let p=new Je;p.setAttribute("position",new Ge(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new At(p,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qc;let A=this.type;this.render=function(T,R,F){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;let C=s.getRenderTarget(),M=s.getActiveCubeFace(),B=s.getActiveMipmapLevel(),U=s.state;U.setBlending(Ai),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let k=A!==Kn&&this.type===Kn,H=A===Kn&&this.type!==Kn;for(let K=0,V=T.length;K<V;K++){let $=T[K],G=$.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);let ie=G.getFrameExtents();if(i.multiply(ie),r.copy(G.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ie.x),i.x=r.x*ie.x,G.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ie.y),i.y=r.y*ie.y,G.mapSize.y=r.y)),G.map===null||k===!0||H===!0){let re=this.type!==Kn?{minFilter:St,magFilter:St}:{};G.map!==null&&G.map.dispose(),G.map=new fn(i.x,i.y,re),G.map.texture.name=$.name+".shadowMap",G.camera.updateProjectionMatrix()}s.setRenderTarget(G.map),s.clear();let le=G.getViewportCount();for(let re=0;re<le;re++){let ye=G.getViewport(re);o.set(r.x*ye.x,r.y*ye.y,r.x*ye.z,r.y*ye.w),U.viewport(o),G.updateMatrices($,re),n=G.getFrustum(),y(R,F,G.camera,$,this.type)}G.isPointLightShadow!==!0&&this.type===Kn&&x(G,F),G.needsUpdate=!1}A=this.type,m.needsUpdate=!1,s.setRenderTarget(C,M,B)};function x(T,R){let F=e.update(g);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,u.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,u.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new fn(i.x,i.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(R,null,F,f,g,null),u.uniforms.shadow_pass.value=T.mapPass.texture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(R,null,F,u,g,null)}function v(T,R,F,C){let M=null,B=F.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(B!==void 0)M=B;else if(M=F.isPointLight===!0?l:a,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let U=M.uuid,k=R.uuid,H=c[U];H===void 0&&(H={},c[U]=H);let K=H[k];K===void 0&&(K=M.clone(),H[k]=K,R.addEventListener("dispose",I)),M=K}if(M.visible=R.visible,M.wireframe=R.wireframe,C===Kn?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:d[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,F.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let U=s.properties.get(M);U.light=F}return M}function y(T,R,F,C,M){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===Kn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,T.matrixWorld);let k=e.update(T),H=T.material;if(Array.isArray(H)){let K=k.groups;for(let V=0,$=K.length;V<$;V++){let G=K[V],ie=H[G.materialIndex];if(ie&&ie.visible){let le=v(T,ie,C,M);T.onBeforeShadow(s,T,R,F,k,le,G),s.renderBufferDirect(F,null,k,le,T,G),T.onAfterShadow(s,T,R,F,k,le,G)}}}else if(H.visible){let K=v(T,H,C,M);T.onBeforeShadow(s,T,R,F,k,K,null),s.renderBufferDirect(F,null,k,K,T,null),T.onAfterShadow(s,T,R,F,k,K,null)}}let U=T.children;for(let k=0,H=U.length;k<H;k++)y(U[k],R,F,C,M)}function I(T){T.target.removeEventListener("dispose",I);for(let F in c){let C=c[F],M=T.target.uuid;M in C&&(C[M].dispose(),delete C[M])}}}var b0={[na]:ia,[sa]:aa,[ra]:ca,[es]:oa,[ia]:na,[aa]:sa,[ca]:ra,[oa]:es};function R0(s,e){function t(){let D=!1,te=new $e,se=null,de=new $e(0,0,0,0);return{setMask:function(Z){se!==Z&&!D&&(s.colorMask(Z,Z,Z,Z),se=Z)},setLocked:function(Z){D=Z},setClear:function(Z,q,me,Le,ut){ut===!0&&(Z*=Le,q*=Le,me*=Le),te.set(Z,q,me,Le),de.equals(te)===!1&&(s.clearColor(Z,q,me,Le),de.copy(te))},reset:function(){D=!1,se=null,de.set(-1,0,0,0)}}}function n(){let D=!1,te=!1,se=null,de=null,Z=null;return{setReversed:function(q){if(te!==q){let me=e.get("EXT_clip_control");q?me.clipControlEXT(me.LOWER_LEFT_EXT,me.ZERO_TO_ONE_EXT):me.clipControlEXT(me.LOWER_LEFT_EXT,me.NEGATIVE_ONE_TO_ONE_EXT),te=q;let Le=Z;Z=null,this.setClear(Le)}},getReversed:function(){return te},setTest:function(q){q?J(s.DEPTH_TEST):pe(s.DEPTH_TEST)},setMask:function(q){se!==q&&!D&&(s.depthMask(q),se=q)},setFunc:function(q){if(te&&(q=b0[q]),de!==q){switch(q){case na:s.depthFunc(s.NEVER);break;case ia:s.depthFunc(s.ALWAYS);break;case sa:s.depthFunc(s.LESS);break;case es:s.depthFunc(s.LEQUAL);break;case ra:s.depthFunc(s.EQUAL);break;case oa:s.depthFunc(s.GEQUAL);break;case aa:s.depthFunc(s.GREATER);break;case ca:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}de=q}},setLocked:function(q){D=q},setClear:function(q){Z!==q&&(te&&(q=1-q),s.clearDepth(q),Z=q)},reset:function(){D=!1,se=null,de=null,Z=null,te=!1}}}function i(){let D=!1,te=null,se=null,de=null,Z=null,q=null,me=null,Le=null,ut=null;return{setTest:function(tt){D||(tt?J(s.STENCIL_TEST):pe(s.STENCIL_TEST))},setMask:function(tt){te!==tt&&!D&&(s.stencilMask(tt),te=tt)},setFunc:function(tt,jn,Un){(se!==tt||de!==jn||Z!==Un)&&(s.stencilFunc(tt,jn,Un),se=tt,de=jn,Z=Un)},setOp:function(tt,jn,Un){(q!==tt||me!==jn||Le!==Un)&&(s.stencilOp(tt,jn,Un),q=tt,me=jn,Le=Un)},setLocked:function(tt){D=tt},setClear:function(tt){ut!==tt&&(s.clearStencil(tt),ut=tt)},reset:function(){D=!1,te=null,se=null,de=null,Z=null,q=null,me=null,Le=null,ut=null}}}let r=new t,o=new n,a=new i,l=new WeakMap,c=new WeakMap,h={},d={},f=new WeakMap,u=[],p=null,g=!1,m=null,A=null,x=null,v=null,y=null,I=null,T=null,R=new fe(0,0,0),F=0,C=!1,M=null,B=null,U=null,k=null,H=null,K=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,$=0,G=s.getParameter(s.VERSION);G.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(G)[1]),V=$>=1):G.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),V=$>=2);let ie=null,le={},re=s.getParameter(s.SCISSOR_BOX),ye=s.getParameter(s.VIEWPORT),ze=new $e().fromArray(re),st=new $e().fromArray(ye);function et(D,te,se,de){let Z=new Uint8Array(4),q=s.createTexture();s.bindTexture(D,q),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let me=0;me<se;me++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(te,0,s.RGBA,1,1,de,0,s.RGBA,s.UNSIGNED_BYTE,Z):s.texImage2D(te+me,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Z);return q}let X={};X[s.TEXTURE_2D]=et(s.TEXTURE_2D,s.TEXTURE_2D,1),X[s.TEXTURE_CUBE_MAP]=et(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[s.TEXTURE_2D_ARRAY]=et(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),X[s.TEXTURE_3D]=et(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),J(s.DEPTH_TEST),o.setFunc(es),Re(!1),ge(Oc),J(s.CULL_FACE),ft(Ai);function J(D){h[D]!==!0&&(s.enable(D),h[D]=!0)}function pe(D){h[D]!==!1&&(s.disable(D),h[D]=!1)}function De(D,te){return d[D]!==te?(s.bindFramebuffer(D,te),d[D]=te,D===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=te),D===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=te),!0):!1}function Ce(D,te){let se=u,de=!1;if(D){se=f.get(te),se===void 0&&(se=[],f.set(te,se));let Z=D.textures;if(se.length!==Z.length||se[0]!==s.COLOR_ATTACHMENT0){for(let q=0,me=Z.length;q<me;q++)se[q]=s.COLOR_ATTACHMENT0+q;se.length=Z.length,de=!0}}else se[0]!==s.BACK&&(se[0]=s.BACK,de=!0);de&&s.drawBuffers(se)}function Ye(D){return p!==D?(s.useProgram(D),p=D,!0):!1}let Gt={[Bi]:s.FUNC_ADD,[lu]:s.FUNC_SUBTRACT,[hu]:s.FUNC_REVERSE_SUBTRACT};Gt[uu]=s.MIN,Gt[du]=s.MAX;let b={[fu]:s.ZERO,[pu]:s.ONE,[Au]:s.SRC_COLOR,[Oo]:s.SRC_ALPHA,[xu]:s.SRC_ALPHA_SATURATE,[yu]:s.DST_COLOR,[gu]:s.DST_ALPHA,[mu]:s.ONE_MINUS_SRC_COLOR,[Qo]:s.ONE_MINUS_SRC_ALPHA,[Eu]:s.ONE_MINUS_DST_COLOR,[_u]:s.ONE_MINUS_DST_ALPHA,[vu]:s.CONSTANT_COLOR,[Mu]:s.ONE_MINUS_CONSTANT_COLOR,[Cu]:s.CONSTANT_ALPHA,[Su]:s.ONE_MINUS_CONSTANT_ALPHA};function ft(D,te,se,de,Z,q,me,Le,ut,tt){if(D===Ai){g===!0&&(pe(s.BLEND),g=!1);return}if(g===!1&&(J(s.BLEND),g=!0),D!==cu){if(D!==m||tt!==C){if((A!==Bi||y!==Bi)&&(s.blendEquation(s.FUNC_ADD),A=Bi,y=Bi),tt)switch(D){case oi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case an:s.blendFunc(s.ONE,s.ONE);break;case kc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Gc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case oi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case an:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case kc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Gc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}x=null,v=null,I=null,T=null,R.set(0,0,0),F=0,m=D,C=tt}return}Z=Z||te,q=q||se,me=me||de,(te!==A||Z!==y)&&(s.blendEquationSeparate(Gt[te],Gt[Z]),A=te,y=Z),(se!==x||de!==v||q!==I||me!==T)&&(s.blendFuncSeparate(b[se],b[de],b[q],b[me]),x=se,v=de,I=q,T=me),(Le.equals(R)===!1||ut!==F)&&(s.blendColor(Le.r,Le.g,Le.b,ut),R.copy(Le),F=ut),m=D,C=!1}function Ne(D,te){D.side===on?pe(s.CULL_FACE):J(s.CULL_FACE);let se=D.side===Pt;te&&(se=!se),Re(se),D.blending===oi&&D.transparent===!1?ft(Ai):ft(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);let de=D.stencilWrite;a.setTest(de),de&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),_e(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?J(s.SAMPLE_ALPHA_TO_COVERAGE):pe(s.SAMPLE_ALPHA_TO_COVERAGE)}function Re(D){M!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),M=D)}function ge(D){D!==ou?(J(s.CULL_FACE),D!==B&&(D===Oc?s.cullFace(s.BACK):D===au?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):pe(s.CULL_FACE),B=D}function pt(D){D!==U&&(V&&s.lineWidth(D),U=D)}function _e(D,te,se){D?(J(s.POLYGON_OFFSET_FILL),(k!==te||H!==se)&&(s.polygonOffset(te,se),k=te,H=se)):pe(s.POLYGON_OFFSET_FILL)}function ke(D){D?J(s.SCISSOR_TEST):pe(s.SCISSOR_TEST)}function Ft(D){D===void 0&&(D=s.TEXTURE0+K-1),ie!==D&&(s.activeTexture(D),ie=D)}function vt(D,te,se){se===void 0&&(ie===null?se=s.TEXTURE0+K-1:se=ie);let de=le[se];de===void 0&&(de={type:void 0,texture:void 0},le[se]=de),(de.type!==D||de.texture!==te)&&(ie!==se&&(s.activeTexture(se),ie=se),s.bindTexture(D,te||X[D]),de.type=D,de.texture=te)}function S(){let D=le[ie];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _(){try{s.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function N(){try{s.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function W(){try{s.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Y(){try{s.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function z(){try{s.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Me(){try{s.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ne(){try{s.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{s.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{s.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ee(){try{s.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function he(D){ze.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),ze.copy(D))}function be(D){st.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),st.copy(D))}function ve(D,te){let se=c.get(te);se===void 0&&(se=new WeakMap,c.set(te,se));let de=se.get(D);de===void 0&&(de=s.getUniformBlockIndex(te,D.name),se.set(D,de))}function ae(D,te){let de=c.get(te).get(D);l.get(te)!==de&&(s.uniformBlockBinding(te,de,D.__bindingPointIndex),l.set(te,de))}function Qe(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},ie=null,le={},d={},f=new WeakMap,u=[],p=null,g=!1,m=null,A=null,x=null,v=null,y=null,I=null,T=null,R=new fe(0,0,0),F=0,C=!1,M=null,B=null,U=null,k=null,H=null,ze.set(0,0,s.canvas.width,s.canvas.height),st.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:J,disable:pe,bindFramebuffer:De,drawBuffers:Ce,useProgram:Ye,setBlending:ft,setMaterial:Ne,setFlipSided:Re,setCullFace:ge,setLineWidth:pt,setPolygonOffset:_e,setScissorTest:ke,activeTexture:Ft,bindTexture:vt,unbindTexture:S,compressedTexImage2D:_,compressedTexImage3D:N,texImage2D:xe,texImage3D:ee,updateUBOMapping:ve,uniformBlockBinding:ae,texStorage2D:ne,texStorage3D:Ee,texSubImage2D:W,texSubImage3D:Y,compressedTexSubImage2D:z,compressedTexSubImage3D:Me,scissor:he,viewport:be,reset:Qe}}function B0(s,e,t,n,i,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Se,h=new WeakMap,d,f=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(S,_){return u?new OffscreenCanvas(S,_):ks("canvas")}function g(S,_,N){let W=1,Y=vt(S);if((Y.width>N||Y.height>N)&&(W=N/Math.max(Y.width,Y.height)),W<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){let z=Math.floor(W*Y.width),Me=Math.floor(W*Y.height);d===void 0&&(d=p(z,Me));let ne=_?p(z,Me):d;return ne.width=z,ne.height=Me,ne.getContext("2d").drawImage(S,0,0,z,Me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Y.width+"x"+Y.height+") to ("+z+"x"+Me+")."),ne}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Y.width+"x"+Y.height+")."),S;return S}function m(S){return S.generateMipmaps}function A(S){s.generateMipmap(S)}function x(S){return S.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?s.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function v(S,_,N,W,Y=!1){if(S!==null){if(s[S]!==void 0)return s[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let z=_;if(_===s.RED&&(N===s.FLOAT&&(z=s.R32F),N===s.HALF_FLOAT&&(z=s.R16F),N===s.UNSIGNED_BYTE&&(z=s.R8)),_===s.RED_INTEGER&&(N===s.UNSIGNED_BYTE&&(z=s.R8UI),N===s.UNSIGNED_SHORT&&(z=s.R16UI),N===s.UNSIGNED_INT&&(z=s.R32UI),N===s.BYTE&&(z=s.R8I),N===s.SHORT&&(z=s.R16I),N===s.INT&&(z=s.R32I)),_===s.RG&&(N===s.FLOAT&&(z=s.RG32F),N===s.HALF_FLOAT&&(z=s.RG16F),N===s.UNSIGNED_BYTE&&(z=s.RG8)),_===s.RG_INTEGER&&(N===s.UNSIGNED_BYTE&&(z=s.RG8UI),N===s.UNSIGNED_SHORT&&(z=s.RG16UI),N===s.UNSIGNED_INT&&(z=s.RG32UI),N===s.BYTE&&(z=s.RG8I),N===s.SHORT&&(z=s.RG16I),N===s.INT&&(z=s.RG32I)),_===s.RGB_INTEGER&&(N===s.UNSIGNED_BYTE&&(z=s.RGB8UI),N===s.UNSIGNED_SHORT&&(z=s.RGB16UI),N===s.UNSIGNED_INT&&(z=s.RGB32UI),N===s.BYTE&&(z=s.RGB8I),N===s.SHORT&&(z=s.RGB16I),N===s.INT&&(z=s.RGB32I)),_===s.RGBA_INTEGER&&(N===s.UNSIGNED_BYTE&&(z=s.RGBA8UI),N===s.UNSIGNED_SHORT&&(z=s.RGBA16UI),N===s.UNSIGNED_INT&&(z=s.RGBA32UI),N===s.BYTE&&(z=s.RGBA8I),N===s.SHORT&&(z=s.RGBA16I),N===s.INT&&(z=s.RGBA32I)),_===s.RGB&&(N===s.UNSIGNED_INT_5_9_9_9_REV&&(z=s.RGB9_E5),N===s.UNSIGNED_INT_10F_11F_11F_REV&&(z=s.R11F_G11F_B10F)),_===s.RGBA){let Me=Y?Qs:We.getTransfer(W);N===s.FLOAT&&(z=s.RGBA32F),N===s.HALF_FLOAT&&(z=s.RGBA16F),N===s.UNSIGNED_BYTE&&(z=Me===it?s.SRGB8_ALPHA8:s.RGBA8),N===s.UNSIGNED_SHORT_4_4_4_4&&(z=s.RGBA4),N===s.UNSIGNED_SHORT_5_5_5_1&&(z=s.RGB5_A1)}return(z===s.R16F||z===s.R32F||z===s.RG16F||z===s.RG32F||z===s.RGBA16F||z===s.RGBA32F)&&e.get("EXT_color_buffer_float"),z}function y(S,_){let N;return S?_===null||_===ki||_===ir?N=s.DEPTH24_STENCIL8:_===Ut?N=s.DEPTH32F_STENCIL8:_===nr&&(N=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ki||_===ir?N=s.DEPTH_COMPONENT24:_===Ut?N=s.DEPTH_COMPONENT32F:_===nr&&(N=s.DEPTH_COMPONENT16),N}function I(S,_){return m(S)===!0||S.isFramebufferTexture&&S.minFilter!==St&&S.minFilter!==Et?Math.log2(Math.max(_.width,_.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?_.mipmaps.length:1}function T(S){let _=S.target;_.removeEventListener("dispose",T),F(_),_.isVideoTexture&&h.delete(_)}function R(S){let _=S.target;_.removeEventListener("dispose",R),M(_)}function F(S){let _=n.get(S);if(_.__webglInit===void 0)return;let N=S.source,W=f.get(N);if(W){let Y=W[_.__cacheKey];Y.usedTimes--,Y.usedTimes===0&&C(S),Object.keys(W).length===0&&f.delete(N)}n.remove(S)}function C(S){let _=n.get(S);s.deleteTexture(_.__webglTexture);let N=S.source,W=f.get(N);delete W[_.__cacheKey],o.memory.textures--}function M(S){let _=n.get(S);if(S.depthTexture&&(S.depthTexture.dispose(),n.remove(S.depthTexture)),S.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(_.__webglFramebuffer[W]))for(let Y=0;Y<_.__webglFramebuffer[W].length;Y++)s.deleteFramebuffer(_.__webglFramebuffer[W][Y]);else s.deleteFramebuffer(_.__webglFramebuffer[W]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[W])}else{if(Array.isArray(_.__webglFramebuffer))for(let W=0;W<_.__webglFramebuffer.length;W++)s.deleteFramebuffer(_.__webglFramebuffer[W]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let W=0;W<_.__webglColorRenderbuffer.length;W++)_.__webglColorRenderbuffer[W]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[W]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let N=S.textures;for(let W=0,Y=N.length;W<Y;W++){let z=n.get(N[W]);z.__webglTexture&&(s.deleteTexture(z.__webglTexture),o.memory.textures--),n.remove(N[W])}n.remove(S)}let B=0;function U(){B=0}function k(){let S=B;return S>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+i.maxTextures),B+=1,S}function H(S){let _=[];return _.push(S.wrapS),_.push(S.wrapT),_.push(S.wrapR||0),_.push(S.magFilter),_.push(S.minFilter),_.push(S.anisotropy),_.push(S.internalFormat),_.push(S.format),_.push(S.type),_.push(S.generateMipmaps),_.push(S.premultiplyAlpha),_.push(S.flipY),_.push(S.unpackAlignment),_.push(S.colorSpace),_.join()}function K(S,_){let N=n.get(S);if(S.isVideoTexture&&ke(S),S.isRenderTargetTexture===!1&&S.isExternalTexture!==!0&&S.version>0&&N.__version!==S.version){let W=S.image;if(W===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(N,S,_);return}}else S.isExternalTexture&&(N.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,N.__webglTexture,s.TEXTURE0+_)}function V(S,_){let N=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&N.__version!==S.version){X(N,S,_);return}t.bindTexture(s.TEXTURE_2D_ARRAY,N.__webglTexture,s.TEXTURE0+_)}function $(S,_){let N=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&N.__version!==S.version){X(N,S,_);return}t.bindTexture(s.TEXTURE_3D,N.__webglTexture,s.TEXTURE0+_)}function G(S,_){let N=n.get(S);if(S.version>0&&N.__version!==S.version){J(N,S,_);return}t.bindTexture(s.TEXTURE_CUBE_MAP,N.__webglTexture,s.TEXTURE0+_)}let ie={[On]:s.REPEAT,[Rn]:s.CLAMP_TO_EDGE,[Ns]:s.MIRRORED_REPEAT},le={[St]:s.NEAREST,[er]:s.NEAREST_MIPMAP_NEAREST,[cs]:s.NEAREST_MIPMAP_LINEAR,[Et]:s.LINEAR,[tr]:s.LINEAR_MIPMAP_NEAREST,[Kt]:s.LINEAR_MIPMAP_LINEAR},re={[Qu]:s.NEVER,[Wu]:s.ALWAYS,[ku]:s.LESS,[Yc]:s.LEQUAL,[Gu]:s.EQUAL,[zu]:s.GEQUAL,[Hu]:s.GREATER,[Vu]:s.NOTEQUAL};function ye(S,_){if(_.type===Ut&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Et||_.magFilter===tr||_.magFilter===cs||_.magFilter===Kt||_.minFilter===Et||_.minFilter===tr||_.minFilter===cs||_.minFilter===Kt)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(S,s.TEXTURE_WRAP_S,ie[_.wrapS]),s.texParameteri(S,s.TEXTURE_WRAP_T,ie[_.wrapT]),(S===s.TEXTURE_3D||S===s.TEXTURE_2D_ARRAY)&&s.texParameteri(S,s.TEXTURE_WRAP_R,ie[_.wrapR]),s.texParameteri(S,s.TEXTURE_MAG_FILTER,le[_.magFilter]),s.texParameteri(S,s.TEXTURE_MIN_FILTER,le[_.minFilter]),_.compareFunction&&(s.texParameteri(S,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(S,s.TEXTURE_COMPARE_FUNC,re[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===St||_.minFilter!==cs&&_.minFilter!==Kt||_.type===Ut&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let N=e.get("EXT_texture_filter_anisotropic");s.texParameterf(S,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function ze(S,_){let N=!1;S.__webglInit===void 0&&(S.__webglInit=!0,_.addEventListener("dispose",T));let W=_.source,Y=f.get(W);Y===void 0&&(Y={},f.set(W,Y));let z=H(_);if(z!==S.__cacheKey){Y[z]===void 0&&(Y[z]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,N=!0),Y[z].usedTimes++;let Me=Y[S.__cacheKey];Me!==void 0&&(Y[S.__cacheKey].usedTimes--,Me.usedTimes===0&&C(_)),S.__cacheKey=z,S.__webglTexture=Y[z].texture}return N}function st(S,_,N){return Math.floor(Math.floor(S/N)/_)}function et(S,_,N,W){let z=S.updateRanges;if(z.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,N,W,_.data);else{z.sort((ee,he)=>ee.start-he.start);let Me=0;for(let ee=1;ee<z.length;ee++){let he=z[Me],be=z[ee],ve=he.start+he.count,ae=st(be.start,_.width,4),Qe=st(he.start,_.width,4);be.start<=ve+1&&ae===Qe&&st(be.start+be.count-1,_.width,4)===ae?he.count=Math.max(he.count,be.start+be.count-he.start):(++Me,z[Me]=be)}z.length=Me+1;let ne=s.getParameter(s.UNPACK_ROW_LENGTH),Ee=s.getParameter(s.UNPACK_SKIP_PIXELS),xe=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let ee=0,he=z.length;ee<he;ee++){let be=z[ee],ve=Math.floor(be.start/4),ae=Math.ceil(be.count/4),Qe=ve%_.width,D=Math.floor(ve/_.width),te=ae,se=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,Qe),s.pixelStorei(s.UNPACK_SKIP_ROWS,D),t.texSubImage2D(s.TEXTURE_2D,0,Qe,D,te,se,N,W,_.data)}S.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ne),s.pixelStorei(s.UNPACK_SKIP_PIXELS,Ee),s.pixelStorei(s.UNPACK_SKIP_ROWS,xe)}}function X(S,_,N){let W=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(W=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(W=s.TEXTURE_3D);let Y=ze(S,_),z=_.source;t.bindTexture(W,S.__webglTexture,s.TEXTURE0+N);let Me=n.get(z);if(z.version!==Me.__version||Y===!0){t.activeTexture(s.TEXTURE0+N);let ne=We.getPrimaries(We.workingColorSpace),Ee=_.colorSpace===Mn?null:We.getPrimaries(_.colorSpace),xe=_.colorSpace===Mn||ne===Ee?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);let ee=g(_.image,!1,i.maxTextureSize);ee=Ft(_,ee);let he=r.convert(_.format,_.colorSpace),be=r.convert(_.type),ve=v(_.internalFormat,he,be,_.colorSpace,_.isVideoTexture);ye(W,_);let ae,Qe=_.mipmaps,D=_.isVideoTexture!==!0,te=Me.__version===void 0||Y===!0,se=z.dataReady,de=I(_,ee);if(_.isDepthTexture)ve=y(_.format===or,_.type),te&&(D?t.texStorage2D(s.TEXTURE_2D,1,ve,ee.width,ee.height):t.texImage2D(s.TEXTURE_2D,0,ve,ee.width,ee.height,0,he,be,null));else if(_.isDataTexture)if(Qe.length>0){D&&te&&t.texStorage2D(s.TEXTURE_2D,de,ve,Qe[0].width,Qe[0].height);for(let Z=0,q=Qe.length;Z<q;Z++)ae=Qe[Z],D?se&&t.texSubImage2D(s.TEXTURE_2D,Z,0,0,ae.width,ae.height,he,be,ae.data):t.texImage2D(s.TEXTURE_2D,Z,ve,ae.width,ae.height,0,he,be,ae.data);_.generateMipmaps=!1}else D?(te&&t.texStorage2D(s.TEXTURE_2D,de,ve,ee.width,ee.height),se&&et(_,ee,he,be)):t.texImage2D(s.TEXTURE_2D,0,ve,ee.width,ee.height,0,he,be,ee.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){D&&te&&t.texStorage3D(s.TEXTURE_2D_ARRAY,de,ve,Qe[0].width,Qe[0].height,ee.depth);for(let Z=0,q=Qe.length;Z<q;Z++)if(ae=Qe[Z],_.format!==Tt)if(he!==null)if(D){if(se)if(_.layerUpdates.size>0){let me=nl(ae.width,ae.height,_.format,_.type);for(let Le of _.layerUpdates){let ut=ae.data.subarray(Le*me/ae.data.BYTES_PER_ELEMENT,(Le+1)*me/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Z,0,0,Le,ae.width,ae.height,1,he,ut)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Z,0,0,0,ae.width,ae.height,ee.depth,he,ae.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Z,ve,ae.width,ae.height,ee.depth,0,ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?se&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,Z,0,0,0,ae.width,ae.height,ee.depth,he,be,ae.data):t.texImage3D(s.TEXTURE_2D_ARRAY,Z,ve,ae.width,ae.height,ee.depth,0,he,be,ae.data)}else{D&&te&&t.texStorage2D(s.TEXTURE_2D,de,ve,Qe[0].width,Qe[0].height);for(let Z=0,q=Qe.length;Z<q;Z++)ae=Qe[Z],_.format!==Tt?he!==null?D?se&&t.compressedTexSubImage2D(s.TEXTURE_2D,Z,0,0,ae.width,ae.height,he,ae.data):t.compressedTexImage2D(s.TEXTURE_2D,Z,ve,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?se&&t.texSubImage2D(s.TEXTURE_2D,Z,0,0,ae.width,ae.height,he,be,ae.data):t.texImage2D(s.TEXTURE_2D,Z,ve,ae.width,ae.height,0,he,be,ae.data)}else if(_.isDataArrayTexture)if(D){if(te&&t.texStorage3D(s.TEXTURE_2D_ARRAY,de,ve,ee.width,ee.height,ee.depth),se)if(_.layerUpdates.size>0){let Z=nl(ee.width,ee.height,_.format,_.type);for(let q of _.layerUpdates){let me=ee.data.subarray(q*Z/ee.data.BYTES_PER_ELEMENT,(q+1)*Z/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,q,ee.width,ee.height,1,he,be,me)}_.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,he,be,ee.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ve,ee.width,ee.height,ee.depth,0,he,be,ee.data);else if(_.isData3DTexture)D?(te&&t.texStorage3D(s.TEXTURE_3D,de,ve,ee.width,ee.height,ee.depth),se&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,he,be,ee.data)):t.texImage3D(s.TEXTURE_3D,0,ve,ee.width,ee.height,ee.depth,0,he,be,ee.data);else if(_.isFramebufferTexture){if(te)if(D)t.texStorage2D(s.TEXTURE_2D,de,ve,ee.width,ee.height);else{let Z=ee.width,q=ee.height;for(let me=0;me<de;me++)t.texImage2D(s.TEXTURE_2D,me,ve,Z,q,0,he,be,null),Z>>=1,q>>=1}}else if(Qe.length>0){if(D&&te){let Z=vt(Qe[0]);t.texStorage2D(s.TEXTURE_2D,de,ve,Z.width,Z.height)}for(let Z=0,q=Qe.length;Z<q;Z++)ae=Qe[Z],D?se&&t.texSubImage2D(s.TEXTURE_2D,Z,0,0,he,be,ae):t.texImage2D(s.TEXTURE_2D,Z,ve,he,be,ae);_.generateMipmaps=!1}else if(D){if(te){let Z=vt(ee);t.texStorage2D(s.TEXTURE_2D,de,ve,Z.width,Z.height)}se&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,he,be,ee)}else t.texImage2D(s.TEXTURE_2D,0,ve,he,be,ee);m(_)&&A(W),Me.__version=z.version,_.onUpdate&&_.onUpdate(_)}S.__version=_.version}function J(S,_,N){if(_.image.length!==6)return;let W=ze(S,_),Y=_.source;t.bindTexture(s.TEXTURE_CUBE_MAP,S.__webglTexture,s.TEXTURE0+N);let z=n.get(Y);if(Y.version!==z.__version||W===!0){t.activeTexture(s.TEXTURE0+N);let Me=We.getPrimaries(We.workingColorSpace),ne=_.colorSpace===Mn?null:We.getPrimaries(_.colorSpace),Ee=_.colorSpace===Mn||Me===ne?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);let xe=_.isCompressedTexture||_.image[0].isCompressedTexture,ee=_.image[0]&&_.image[0].isDataTexture,he=[];for(let q=0;q<6;q++)!xe&&!ee?he[q]=g(_.image[q],!0,i.maxCubemapSize):he[q]=ee?_.image[q].image:_.image[q],he[q]=Ft(_,he[q]);let be=he[0],ve=r.convert(_.format,_.colorSpace),ae=r.convert(_.type),Qe=v(_.internalFormat,ve,ae,_.colorSpace),D=_.isVideoTexture!==!0,te=z.__version===void 0||W===!0,se=Y.dataReady,de=I(_,be);ye(s.TEXTURE_CUBE_MAP,_);let Z;if(xe){D&&te&&t.texStorage2D(s.TEXTURE_CUBE_MAP,de,Qe,be.width,be.height);for(let q=0;q<6;q++){Z=he[q].mipmaps;for(let me=0;me<Z.length;me++){let Le=Z[me];_.format!==Tt?ve!==null?D?se&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,me,0,0,Le.width,Le.height,ve,Le.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,me,Qe,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,me,0,0,Le.width,Le.height,ve,ae,Le.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,me,Qe,Le.width,Le.height,0,ve,ae,Le.data)}}}else{if(Z=_.mipmaps,D&&te){Z.length>0&&de++;let q=vt(he[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,de,Qe,q.width,q.height)}for(let q=0;q<6;q++)if(ee){D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,he[q].width,he[q].height,ve,ae,he[q].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Qe,he[q].width,he[q].height,0,ve,ae,he[q].data);for(let me=0;me<Z.length;me++){let ut=Z[me].image[q].image;D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,me+1,0,0,ut.width,ut.height,ve,ae,ut.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,me+1,Qe,ut.width,ut.height,0,ve,ae,ut.data)}}else{D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,ve,ae,he[q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Qe,ve,ae,he[q]);for(let me=0;me<Z.length;me++){let Le=Z[me];D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,me+1,0,0,ve,ae,Le.image[q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,me+1,Qe,ve,ae,Le.image[q])}}}m(_)&&A(s.TEXTURE_CUBE_MAP),z.__version=Y.version,_.onUpdate&&_.onUpdate(_)}S.__version=_.version}function pe(S,_,N,W,Y,z){let Me=r.convert(N.format,N.colorSpace),ne=r.convert(N.type),Ee=v(N.internalFormat,Me,ne,N.colorSpace),xe=n.get(_),ee=n.get(N);if(ee.__renderTarget=_,!xe.__hasExternalTextures){let he=Math.max(1,_.width>>z),be=Math.max(1,_.height>>z);Y===s.TEXTURE_3D||Y===s.TEXTURE_2D_ARRAY?t.texImage3D(Y,z,Ee,he,be,_.depth,0,Me,ne,null):t.texImage2D(Y,z,Ee,he,be,0,Me,ne,null)}t.bindFramebuffer(s.FRAMEBUFFER,S),_e(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,W,Y,ee.__webglTexture,0,pt(_)):(Y===s.TEXTURE_2D||Y>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Y<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,W,Y,ee.__webglTexture,z),t.bindFramebuffer(s.FRAMEBUFFER,null)}function De(S,_,N){if(s.bindRenderbuffer(s.RENDERBUFFER,S),_.depthBuffer){let W=_.depthTexture,Y=W&&W.isDepthTexture?W.type:null,z=y(_.stencilBuffer,Y),Me=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ne=pt(_);_e(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ne,z,_.width,_.height):N?s.renderbufferStorageMultisample(s.RENDERBUFFER,ne,z,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,z,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Me,s.RENDERBUFFER,S)}else{let W=_.textures;for(let Y=0;Y<W.length;Y++){let z=W[Y],Me=r.convert(z.format,z.colorSpace),ne=r.convert(z.type),Ee=v(z.internalFormat,Me,ne,z.colorSpace),xe=pt(_);N&&_e(_)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,xe,Ee,_.width,_.height):_e(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,xe,Ee,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,Ee,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ce(S,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,S),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let W=n.get(_.depthTexture);W.__renderTarget=_,(!W.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),K(_.depthTexture,0);let Y=W.__webglTexture,z=pt(_);if(_.depthTexture.format===Os)_e(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Y,0,z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Y,0);else if(_.depthTexture.format===or)_e(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Y,0,z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Y,0);else throw new Error("Unknown depthTexture format")}function Ye(S){let _=n.get(S),N=S.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==S.depthTexture){let W=S.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),W){let Y=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,W.removeEventListener("dispose",Y)};W.addEventListener("dispose",Y),_.__depthDisposeCallback=Y}_.__boundDepthTexture=W}if(S.depthTexture&&!_.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");let W=S.texture.mipmaps;W&&W.length>0?Ce(_.__webglFramebuffer[0],S):Ce(_.__webglFramebuffer,S)}else if(N){_.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[W]),_.__webglDepthbuffer[W]===void 0)_.__webglDepthbuffer[W]=s.createRenderbuffer(),De(_.__webglDepthbuffer[W],S,!1);else{let Y=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,z=_.__webglDepthbuffer[W];s.bindRenderbuffer(s.RENDERBUFFER,z),s.framebufferRenderbuffer(s.FRAMEBUFFER,Y,s.RENDERBUFFER,z)}}else{let W=S.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),De(_.__webglDepthbuffer,S,!1);else{let Y=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,z=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,z),s.framebufferRenderbuffer(s.FRAMEBUFFER,Y,s.RENDERBUFFER,z)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Gt(S,_,N){let W=n.get(S);_!==void 0&&pe(W.__webglFramebuffer,S,S.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),N!==void 0&&Ye(S)}function b(S){let _=S.texture,N=n.get(S),W=n.get(_);S.addEventListener("dispose",R);let Y=S.textures,z=S.isWebGLCubeRenderTarget===!0,Me=Y.length>1;if(Me||(W.__webglTexture===void 0&&(W.__webglTexture=s.createTexture()),W.__version=_.version,o.memory.textures++),z){N.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer[ne]=[];for(let Ee=0;Ee<_.mipmaps.length;Ee++)N.__webglFramebuffer[ne][Ee]=s.createFramebuffer()}else N.__webglFramebuffer[ne]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer=[];for(let ne=0;ne<_.mipmaps.length;ne++)N.__webglFramebuffer[ne]=s.createFramebuffer()}else N.__webglFramebuffer=s.createFramebuffer();if(Me)for(let ne=0,Ee=Y.length;ne<Ee;ne++){let xe=n.get(Y[ne]);xe.__webglTexture===void 0&&(xe.__webglTexture=s.createTexture(),o.memory.textures++)}if(S.samples>0&&_e(S)===!1){N.__webglMultisampledFramebuffer=s.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let ne=0;ne<Y.length;ne++){let Ee=Y[ne];N.__webglColorRenderbuffer[ne]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,N.__webglColorRenderbuffer[ne]);let xe=r.convert(Ee.format,Ee.colorSpace),ee=r.convert(Ee.type),he=v(Ee.internalFormat,xe,ee,Ee.colorSpace,S.isXRRenderTarget===!0),be=pt(S);s.renderbufferStorageMultisample(s.RENDERBUFFER,be,he,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ne,s.RENDERBUFFER,N.__webglColorRenderbuffer[ne])}s.bindRenderbuffer(s.RENDERBUFFER,null),S.depthBuffer&&(N.__webglDepthRenderbuffer=s.createRenderbuffer(),De(N.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(z){t.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture),ye(s.TEXTURE_CUBE_MAP,_);for(let ne=0;ne<6;ne++)if(_.mipmaps&&_.mipmaps.length>0)for(let Ee=0;Ee<_.mipmaps.length;Ee++)pe(N.__webglFramebuffer[ne][Ee],S,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ee);else pe(N.__webglFramebuffer[ne],S,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);m(_)&&A(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let ne=0,Ee=Y.length;ne<Ee;ne++){let xe=Y[ne],ee=n.get(xe),he=s.TEXTURE_2D;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(he=S.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(he,ee.__webglTexture),ye(he,xe),pe(N.__webglFramebuffer,S,xe,s.COLOR_ATTACHMENT0+ne,he,0),m(xe)&&A(he)}t.unbindTexture()}else{let ne=s.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(ne=S.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ne,W.__webglTexture),ye(ne,_),_.mipmaps&&_.mipmaps.length>0)for(let Ee=0;Ee<_.mipmaps.length;Ee++)pe(N.__webglFramebuffer[Ee],S,_,s.COLOR_ATTACHMENT0,ne,Ee);else pe(N.__webglFramebuffer,S,_,s.COLOR_ATTACHMENT0,ne,0);m(_)&&A(ne),t.unbindTexture()}S.depthBuffer&&Ye(S)}function ft(S){let _=S.textures;for(let N=0,W=_.length;N<W;N++){let Y=_[N];if(m(Y)){let z=x(S),Me=n.get(Y).__webglTexture;t.bindTexture(z,Me),A(z),t.unbindTexture()}}}let Ne=[],Re=[];function ge(S){if(S.samples>0){if(_e(S)===!1){let _=S.textures,N=S.width,W=S.height,Y=s.COLOR_BUFFER_BIT,z=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Me=n.get(S),ne=_.length>1;if(ne)for(let xe=0;xe<_.length;xe++)t.bindFramebuffer(s.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Me.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer);let Ee=S.texture.mipmaps;Ee&&Ee.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let xe=0;xe<_.length;xe++){if(S.resolveDepthBuffer&&(S.depthBuffer&&(Y|=s.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&(Y|=s.STENCIL_BUFFER_BIT)),ne){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Me.__webglColorRenderbuffer[xe]);let ee=n.get(_[xe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ee,0)}s.blitFramebuffer(0,0,N,W,0,0,N,W,Y,s.NEAREST),l===!0&&(Ne.length=0,Re.length=0,Ne.push(s.COLOR_ATTACHMENT0+xe),S.depthBuffer&&S.resolveDepthBuffer===!1&&(Ne.push(z),Re.push(z),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Re)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ne))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ne)for(let xe=0;xe<_.length;xe++){t.bindFramebuffer(s.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.RENDERBUFFER,Me.__webglColorRenderbuffer[xe]);let ee=n.get(_[xe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Me.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.TEXTURE_2D,ee,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.resolveDepthBuffer===!1&&l){let _=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function pt(S){return Math.min(i.maxSamples,S.samples)}function _e(S){let _=n.get(S);return S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function ke(S){let _=o.render.frame;h.get(S)!==_&&(h.set(S,_),S.update())}function Ft(S,_){let N=S.colorSpace,W=S.format,Y=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||N!==wt&&N!==Mn&&(We.getTransfer(N)===it?(W!==Tt||Y!==Ue)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),_}function vt(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(c.width=S.naturalWidth||S.width,c.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(c.width=S.displayWidth,c.height=S.displayHeight):(c.width=S.width,c.height=S.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=U,this.setTexture2D=K,this.setTexture2DArray=V,this.setTexture3D=$,this.setTextureCube=G,this.rebindTextures=Gt,this.setupRenderTarget=b,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=ge,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=_e}function D0(s,e){function t(n,i=Mn){let r,o=We.getTransfer(i);if(n===Ue)return s.UNSIGNED_BYTE;if(n===da)return s.UNSIGNED_SHORT_4_4_4_4;if(n===fa)return s.UNSIGNED_SHORT_5_5_5_1;if(n===sr)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===rr)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===zc)return s.BYTE;if(n===Wc)return s.SHORT;if(n===nr)return s.UNSIGNED_SHORT;if(n===ua)return s.INT;if(n===ki)return s.UNSIGNED_INT;if(n===Ut)return s.FLOAT;if(n===Xt)return s.HALF_FLOAT;if(n===Kc)return s.ALPHA;if(n===ls)return s.RGB;if(n===Tt)return s.RGBA;if(n===Os)return s.DEPTH_COMPONENT;if(n===or)return s.DEPTH_STENCIL;if(n===Xn)return s.RED;if(n===pa)return s.RED_INTEGER;if(n===gi)return s.RG;if(n===Aa)return s.RG_INTEGER;if(n===ma)return s.RGBA_INTEGER;if(n===Gi||n===_i||n===Hi||n===hs)if(o===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Gi)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_i)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hi)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Gi)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_i)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hi)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===hs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ar||n===ga||n===Vi||n===us)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ar)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ga)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Vi)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===us)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===cr||n===ds||n===fs)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===cr||n===ds)return o===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===fs)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===yi||n===_a||n===ya||n===Ea||n===zi||n===xa||n===va||n===Ma||n===Ca||n===Sa||n===Ia||n===Ta||n===wa||n===ba)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===yi)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===_a)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ya)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ea)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===zi)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===xa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===va)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ma)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ca)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Sa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ia)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ta)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wa)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ba)return o===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Wi||n===Ra||n===lr)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Wi)return o===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ra)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===lr)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===hr||n===ur||n===dr||n===fr)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===hr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ur)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===dr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===fr)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ir?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}var F0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,L0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Al=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new qr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ht({vertexShader:F0,fragmentShader:L0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new At(new Ni(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ml=class extends Qn{constructor(e,t){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,f=null,u=null,p=null,g=typeof XRWebGLBinding<"u",m=new Al,A={},x=t.getContextAttributes(),v=null,y=null,I=[],T=[],R=new Se,F=null,C=new Ct;C.viewport=new $e;let M=new Ct;M.viewport=new $e;let B=[C,M],U=new ea,k=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let J=I[X];return J===void 0&&(J=new Ws,I[X]=J),J.getTargetRaySpace()},this.getControllerGrip=function(X){let J=I[X];return J===void 0&&(J=new Ws,I[X]=J),J.getGripSpace()},this.getHand=function(X){let J=I[X];return J===void 0&&(J=new Ws,I[X]=J),J.getHandSpace()};function K(X){let J=T.indexOf(X.inputSource);if(J===-1)return;let pe=I[J];pe!==void 0&&(pe.update(X.inputSource,X.frame,c||o),pe.dispatchEvent({type:X.type,data:X.inputSource}))}function V(){i.removeEventListener("select",K),i.removeEventListener("selectstart",K),i.removeEventListener("selectend",K),i.removeEventListener("squeeze",K),i.removeEventListener("squeezestart",K),i.removeEventListener("squeezeend",K),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",$);for(let X=0;X<I.length;X++){let J=T[X];J!==null&&(T[X]=null,I[X].disconnect(J))}k=null,H=null,m.reset();for(let X in A)delete A[X];e.setRenderTarget(v),u=null,f=null,d=null,i=null,y=null,et.stop(),n.isPresenting=!1,e.setPixelRatio(F),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return f!==null?f:u},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(X){if(i=X,i!==null){if(v=e.getRenderTarget(),i.addEventListener("select",K),i.addEventListener("selectstart",K),i.addEventListener("selectend",K),i.addEventListener("squeeze",K),i.addEventListener("squeezestart",K),i.addEventListener("squeezeend",K),i.addEventListener("end",V),i.addEventListener("inputsourceschange",$),x.xrCompatible!==!0&&await t.makeXRCompatible(),F=e.getPixelRatio(),e.getSize(R),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,De=null,Ce=null;x.depth&&(Ce=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=x.stencil?or:Os,De=x.stencil?ir:ki);let Ye={colorFormat:t.RGBA8,depthFormat:Ce,scaleFactor:r};d=this.getBinding(),f=d.createProjectionLayer(Ye),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new fn(f.textureWidth,f.textureHeight,{format:Tt,type:Ue,depthTexture:new Xr(f.textureWidth,f.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let pe={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(i,t,pe),i.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new fn(u.framebufferWidth,u.framebufferHeight,{format:Tt,type:Ue,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),et.setContext(i),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(X){for(let J=0;J<X.removed.length;J++){let pe=X.removed[J],De=T.indexOf(pe);De>=0&&(T[De]=null,I[De].disconnect(pe))}for(let J=0;J<X.added.length;J++){let pe=X.added[J],De=T.indexOf(pe);if(De===-1){for(let Ye=0;Ye<I.length;Ye++)if(Ye>=T.length){T.push(pe),De=Ye;break}else if(T[Ye]===null){T[Ye]=pe,De=Ye;break}if(De===-1)break}let Ce=I[De];Ce&&Ce.connect(pe)}}let G=new w,ie=new w;function le(X,J,pe){G.setFromMatrixPosition(J.matrixWorld),ie.setFromMatrixPosition(pe.matrixWorld);let De=G.distanceTo(ie),Ce=J.projectionMatrix.elements,Ye=pe.projectionMatrix.elements,Gt=Ce[14]/(Ce[10]-1),b=Ce[14]/(Ce[10]+1),ft=(Ce[9]+1)/Ce[5],Ne=(Ce[9]-1)/Ce[5],Re=(Ce[8]-1)/Ce[0],ge=(Ye[8]+1)/Ye[0],pt=Gt*Re,_e=Gt*ge,ke=De/(-Re+ge),Ft=ke*-Re;if(J.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Ft),X.translateZ(ke),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ce[10]===-1)X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{let vt=Gt+ke,S=b+ke,_=pt-Ft,N=_e+(De-Ft),W=ft*b/S*vt,Y=Ne*b/S*vt;X.projectionMatrix.makePerspective(_,N,W,Y,vt,S),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function re(X,J){J===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(J.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(i===null)return;let J=X.near,pe=X.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),U.near=M.near=C.near=J,U.far=M.far=C.far=pe,(k!==U.near||H!==U.far)&&(i.updateRenderState({depthNear:U.near,depthFar:U.far}),k=U.near,H=U.far),U.layers.mask=X.layers.mask|6,C.layers.mask=U.layers.mask&3,M.layers.mask=U.layers.mask&5;let De=X.parent,Ce=U.cameras;re(U,De);for(let Ye=0;Ye<Ce.length;Ye++)re(Ce[Ye],De);Ce.length===2?le(U,C,M):U.projectionMatrix.copy(C.projectionMatrix),ye(X,U,De)};function ye(X,J,pe){pe===null?X.matrix.copy(J.matrixWorld):(X.matrix.copy(pe.matrixWorld),X.matrix.invert(),X.matrix.multiply(J.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=is*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(f===null&&u===null))return l},this.setFoveation=function(X){l=X,f!==null&&(f.fixedFoveation=X),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=X)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(X){return A[X]};let ze=null;function st(X,J){if(h=J.getViewerPose(c||o),p=J,h!==null){let pe=h.views;u!==null&&(e.setRenderTargetFramebuffer(y,u.framebuffer),e.setRenderTarget(y));let De=!1;pe.length!==U.cameras.length&&(U.cameras.length=0,De=!0);for(let b=0;b<pe.length;b++){let ft=pe[b],Ne=null;if(u!==null)Ne=u.getViewport(ft);else{let ge=d.getViewSubImage(f,ft);Ne=ge.viewport,b===0&&(e.setRenderTargetTextures(y,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(y))}let Re=B[b];Re===void 0&&(Re=new Ct,Re.layers.enable(b),Re.viewport=new $e,B[b]=Re),Re.matrix.fromArray(ft.transform.matrix),Re.matrix.decompose(Re.position,Re.quaternion,Re.scale),Re.projectionMatrix.fromArray(ft.projectionMatrix),Re.projectionMatrixInverse.copy(Re.projectionMatrix).invert(),Re.viewport.set(Ne.x,Ne.y,Ne.width,Ne.height),b===0&&(U.matrix.copy(Re.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),De===!0&&U.cameras.push(Re)}let Ce=i.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&g){d=n.getBinding();let b=d.getDepthInformation(pe[0]);b&&b.isValid&&b.texture&&m.init(b,i.renderState)}if(Ce&&Ce.includes("camera-access")&&g){e.state.unbindTexture(),d=n.getBinding();for(let b=0;b<pe.length;b++){let ft=pe[b].camera;if(ft){let Ne=A[ft];Ne||(Ne=new qr,A[ft]=Ne);let Re=d.getCameraImage(ft);Ne.sourceTexture=Re}}}}for(let pe=0;pe<I.length;pe++){let De=T[pe],Ce=I[pe];De!==null&&Ce!==void 0&&Ce.update(De,J,c||o)}ze&&ze(X,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),p=null}let et=new xd;et.setAnimationLoop(st),this.setAnimationLoop=function(X){ze=X},this.dispose=function(){}}},ms=new Ln,P0=new Oe;function U0(s,e){function t(m,A){m.matrixAutoUpdate===!0&&m.updateMatrix(),A.value.copy(m.matrix)}function n(m,A){A.color.getRGB(m.fogColor.value,$c(s)),A.isFog?(m.fogNear.value=A.near,m.fogFar.value=A.far):A.isFogExp2&&(m.fogDensity.value=A.density)}function i(m,A,x,v,y){A.isMeshBasicMaterial||A.isMeshLambertMaterial?r(m,A):A.isMeshToonMaterial?(r(m,A),d(m,A)):A.isMeshPhongMaterial?(r(m,A),h(m,A)):A.isMeshStandardMaterial?(r(m,A),f(m,A),A.isMeshPhysicalMaterial&&u(m,A,y)):A.isMeshMatcapMaterial?(r(m,A),p(m,A)):A.isMeshDepthMaterial?r(m,A):A.isMeshDistanceMaterial?(r(m,A),g(m,A)):A.isMeshNormalMaterial?r(m,A):A.isLineBasicMaterial?(o(m,A),A.isLineDashedMaterial&&a(m,A)):A.isPointsMaterial?l(m,A,x,v):A.isSpriteMaterial?c(m,A):A.isShadowMaterial?(m.color.value.copy(A.color),m.opacity.value=A.opacity):A.isShaderMaterial&&(A.uniformsNeedUpdate=!1)}function r(m,A){m.opacity.value=A.opacity,A.color&&m.diffuse.value.copy(A.color),A.emissive&&m.emissive.value.copy(A.emissive).multiplyScalar(A.emissiveIntensity),A.map&&(m.map.value=A.map,t(A.map,m.mapTransform)),A.alphaMap&&(m.alphaMap.value=A.alphaMap,t(A.alphaMap,m.alphaMapTransform)),A.bumpMap&&(m.bumpMap.value=A.bumpMap,t(A.bumpMap,m.bumpMapTransform),m.bumpScale.value=A.bumpScale,A.side===Pt&&(m.bumpScale.value*=-1)),A.normalMap&&(m.normalMap.value=A.normalMap,t(A.normalMap,m.normalMapTransform),m.normalScale.value.copy(A.normalScale),A.side===Pt&&m.normalScale.value.negate()),A.displacementMap&&(m.displacementMap.value=A.displacementMap,t(A.displacementMap,m.displacementMapTransform),m.displacementScale.value=A.displacementScale,m.displacementBias.value=A.displacementBias),A.emissiveMap&&(m.emissiveMap.value=A.emissiveMap,t(A.emissiveMap,m.emissiveMapTransform)),A.specularMap&&(m.specularMap.value=A.specularMap,t(A.specularMap,m.specularMapTransform)),A.alphaTest>0&&(m.alphaTest.value=A.alphaTest);let x=e.get(A),v=x.envMap,y=x.envMapRotation;v&&(m.envMap.value=v,ms.copy(y),ms.x*=-1,ms.y*=-1,ms.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ms.y*=-1,ms.z*=-1),m.envMapRotation.value.setFromMatrix4(P0.makeRotationFromEuler(ms)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=A.reflectivity,m.ior.value=A.ior,m.refractionRatio.value=A.refractionRatio),A.lightMap&&(m.lightMap.value=A.lightMap,m.lightMapIntensity.value=A.lightMapIntensity,t(A.lightMap,m.lightMapTransform)),A.aoMap&&(m.aoMap.value=A.aoMap,m.aoMapIntensity.value=A.aoMapIntensity,t(A.aoMap,m.aoMapTransform))}function o(m,A){m.diffuse.value.copy(A.color),m.opacity.value=A.opacity,A.map&&(m.map.value=A.map,t(A.map,m.mapTransform))}function a(m,A){m.dashSize.value=A.dashSize,m.totalSize.value=A.dashSize+A.gapSize,m.scale.value=A.scale}function l(m,A,x,v){m.diffuse.value.copy(A.color),m.opacity.value=A.opacity,m.size.value=A.size*x,m.scale.value=v*.5,A.map&&(m.map.value=A.map,t(A.map,m.uvTransform)),A.alphaMap&&(m.alphaMap.value=A.alphaMap,t(A.alphaMap,m.alphaMapTransform)),A.alphaTest>0&&(m.alphaTest.value=A.alphaTest)}function c(m,A){m.diffuse.value.copy(A.color),m.opacity.value=A.opacity,m.rotation.value=A.rotation,A.map&&(m.map.value=A.map,t(A.map,m.mapTransform)),A.alphaMap&&(m.alphaMap.value=A.alphaMap,t(A.alphaMap,m.alphaMapTransform)),A.alphaTest>0&&(m.alphaTest.value=A.alphaTest)}function h(m,A){m.specular.value.copy(A.specular),m.shininess.value=Math.max(A.shininess,1e-4)}function d(m,A){A.gradientMap&&(m.gradientMap.value=A.gradientMap)}function f(m,A){m.metalness.value=A.metalness,A.metalnessMap&&(m.metalnessMap.value=A.metalnessMap,t(A.metalnessMap,m.metalnessMapTransform)),m.roughness.value=A.roughness,A.roughnessMap&&(m.roughnessMap.value=A.roughnessMap,t(A.roughnessMap,m.roughnessMapTransform)),A.envMap&&(m.envMapIntensity.value=A.envMapIntensity)}function u(m,A,x){m.ior.value=A.ior,A.sheen>0&&(m.sheenColor.value.copy(A.sheenColor).multiplyScalar(A.sheen),m.sheenRoughness.value=A.sheenRoughness,A.sheenColorMap&&(m.sheenColorMap.value=A.sheenColorMap,t(A.sheenColorMap,m.sheenColorMapTransform)),A.sheenRoughnessMap&&(m.sheenRoughnessMap.value=A.sheenRoughnessMap,t(A.sheenRoughnessMap,m.sheenRoughnessMapTransform))),A.clearcoat>0&&(m.clearcoat.value=A.clearcoat,m.clearcoatRoughness.value=A.clearcoatRoughness,A.clearcoatMap&&(m.clearcoatMap.value=A.clearcoatMap,t(A.clearcoatMap,m.clearcoatMapTransform)),A.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=A.clearcoatRoughnessMap,t(A.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),A.clearcoatNormalMap&&(m.clearcoatNormalMap.value=A.clearcoatNormalMap,t(A.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(A.clearcoatNormalScale),A.side===Pt&&m.clearcoatNormalScale.value.negate())),A.dispersion>0&&(m.dispersion.value=A.dispersion),A.iridescence>0&&(m.iridescence.value=A.iridescence,m.iridescenceIOR.value=A.iridescenceIOR,m.iridescenceThicknessMinimum.value=A.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=A.iridescenceThicknessRange[1],A.iridescenceMap&&(m.iridescenceMap.value=A.iridescenceMap,t(A.iridescenceMap,m.iridescenceMapTransform)),A.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=A.iridescenceThicknessMap,t(A.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),A.transmission>0&&(m.transmission.value=A.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),A.transmissionMap&&(m.transmissionMap.value=A.transmissionMap,t(A.transmissionMap,m.transmissionMapTransform)),m.thickness.value=A.thickness,A.thicknessMap&&(m.thicknessMap.value=A.thicknessMap,t(A.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=A.attenuationDistance,m.attenuationColor.value.copy(A.attenuationColor)),A.anisotropy>0&&(m.anisotropyVector.value.set(A.anisotropy*Math.cos(A.anisotropyRotation),A.anisotropy*Math.sin(A.anisotropyRotation)),A.anisotropyMap&&(m.anisotropyMap.value=A.anisotropyMap,t(A.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=A.specularIntensity,m.specularColor.value.copy(A.specularColor),A.specularColorMap&&(m.specularColorMap.value=A.specularColorMap,t(A.specularColorMap,m.specularColorMapTransform)),A.specularIntensityMap&&(m.specularIntensityMap.value=A.specularIntensityMap,t(A.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,A){A.matcap&&(m.matcap.value=A.matcap)}function g(m,A){let x=e.get(A).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function N0(s,e,t,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,v){let y=v.program;n.uniformBlockBinding(x,y)}function c(x,v){let y=i[x.id];y===void 0&&(p(x),y=h(x),i[x.id]=y,x.addEventListener("dispose",m));let I=v.program;n.updateUBOMapping(x,I);let T=e.render.frame;r[x.id]!==T&&(f(x),r[x.id]=T)}function h(x){let v=d();x.__bindingPointIndex=v;let y=s.createBuffer(),I=x.__size,T=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,I,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,y),y}function d(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){let v=i[x.id],y=x.uniforms,I=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let T=0,R=y.length;T<R;T++){let F=Array.isArray(y[T])?y[T]:[y[T]];for(let C=0,M=F.length;C<M;C++){let B=F[C];if(u(B,T,C,I)===!0){let U=B.__offset,k=Array.isArray(B.value)?B.value:[B.value],H=0;for(let K=0;K<k.length;K++){let V=k[K],$=g(V);typeof V=="number"||typeof V=="boolean"?(B.__data[0]=V,s.bufferSubData(s.UNIFORM_BUFFER,U+H,B.__data)):V.isMatrix3?(B.__data[0]=V.elements[0],B.__data[1]=V.elements[1],B.__data[2]=V.elements[2],B.__data[3]=0,B.__data[4]=V.elements[3],B.__data[5]=V.elements[4],B.__data[6]=V.elements[5],B.__data[7]=0,B.__data[8]=V.elements[6],B.__data[9]=V.elements[7],B.__data[10]=V.elements[8],B.__data[11]=0):(V.toArray(B.__data,H),H+=$.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,U,B.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function u(x,v,y,I){let T=x.value,R=v+"_"+y;if(I[R]===void 0)return typeof T=="number"||typeof T=="boolean"?I[R]=T:I[R]=T.clone(),!0;{let F=I[R];if(typeof T=="number"||typeof T=="boolean"){if(F!==T)return I[R]=T,!0}else if(F.equals(T)===!1)return F.copy(T),!0}return!1}function p(x){let v=x.uniforms,y=0,I=16;for(let R=0,F=v.length;R<F;R++){let C=Array.isArray(v[R])?v[R]:[v[R]];for(let M=0,B=C.length;M<B;M++){let U=C[M],k=Array.isArray(U.value)?U.value:[U.value];for(let H=0,K=k.length;H<K;H++){let V=k[H],$=g(V),G=y%I,ie=G%$.boundary,le=G+ie;y+=ie,le!==0&&I-le<$.storage&&(y+=I-le),U.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=y,y+=$.storage}}}let T=y%I;return T>0&&(y+=I-T),x.__size=y,x.__cache={},this}function g(x){let v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function m(x){let v=x.target;v.removeEventListener("dispose",m);let y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function A(){for(let x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:l,update:c,dispose:A}}var La=class{constructor(e={}){let{canvas:t=Ku(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=o;let p=new Uint32Array(4),g=new Int32Array(4),m=null,A=null,x=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,I=!1;this._outputColorSpace=nt;let T=0,R=0,F=null,C=-1,M=null,B=new $e,U=new $e,k=null,H=new fe(0),K=0,V=t.width,$=t.height,G=1,ie=null,le=null,re=new $e(0,0,V,$),ye=new $e(0,0,V,$),ze=!1,st=new Ys,et=!1,X=!1,J=new Oe,pe=new w,De=new $e,Ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ye=!1;function Gt(){return F===null?G:1}let b=n;function ft(E,L){return t.getContext(E,L)}try{let E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",se,!1),t.addEventListener("webglcontextrestored",de,!1),t.addEventListener("webglcontextcreationerror",Z,!1),b===null){let L="webgl2";if(b=ft(L,E),b===null)throw ft(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ne,Re,ge,pt,_e,ke,Ft,vt,S,_,N,W,Y,z,Me,ne,Ee,xe,ee,he,be,ve,ae,Qe;function D(){Ne=new t_(b),Ne.init(),ve=new D0(b,Ne),Re=new qg(b,Ne,e,ve),ge=new R0(b,Ne),Re.reversedDepthBuffer&&f&&ge.buffers.depth.setReversed(!0),pt=new s_(b),_e=new g0,ke=new B0(b,Ne,ge,_e,Re,ve,pt),Ft=new Jg(y),vt=new e_(y),S=new hA(b),ae=new Kg(b,S),_=new n_(b,S,pt,ae),N=new o_(b,_,S,pt),ee=new r_(b,Re,ke),ne=new Yg(_e),W=new m0(y,Ft,vt,Ne,Re,ae,ne),Y=new U0(y,_e),z=new y0,Me=new S0(Ne),xe=new Wg(y,Ft,vt,ge,N,u,l),Ee=new w0(y,N,Re),Qe=new N0(b,pt,Re,ge),he=new Xg(b,Ne,pt),be=new i_(b,Ne,pt),pt.programs=W.programs,y.capabilities=Re,y.extensions=Ne,y.properties=_e,y.renderLists=z,y.shadowMap=Ee,y.state=ge,y.info=pt}D();let te=new ml(y,b);this.xr=te,this.getContext=function(){return b},this.getContextAttributes=function(){return b.getContextAttributes()},this.forceContextLoss=function(){let E=Ne.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Ne.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(E){E!==void 0&&(G=E,this.setSize(V,$,!1))},this.getSize=function(E){return E.set(V,$)},this.setSize=function(E,L,O=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=E,$=L,t.width=Math.floor(E*G),t.height=Math.floor(L*G),O===!0&&(t.style.width=E+"px",t.style.height=L+"px"),this.setViewport(0,0,E,L)},this.getDrawingBufferSize=function(E){return E.set(V*G,$*G).floor()},this.setDrawingBufferSize=function(E,L,O){V=E,$=L,G=O,t.width=Math.floor(E*O),t.height=Math.floor(L*O),this.setViewport(0,0,E,L)},this.getCurrentViewport=function(E){return E.copy(B)},this.getViewport=function(E){return E.copy(re)},this.setViewport=function(E,L,O,Q){E.isVector4?re.set(E.x,E.y,E.z,E.w):re.set(E,L,O,Q),ge.viewport(B.copy(re).multiplyScalar(G).round())},this.getScissor=function(E){return E.copy(ye)},this.setScissor=function(E,L,O,Q){E.isVector4?ye.set(E.x,E.y,E.z,E.w):ye.set(E,L,O,Q),ge.scissor(U.copy(ye).multiplyScalar(G).round())},this.getScissorTest=function(){return ze},this.setScissorTest=function(E){ge.setScissorTest(ze=E)},this.setOpaqueSort=function(E){ie=E},this.setTransparentSort=function(E){le=E},this.getClearColor=function(E){return E.copy(xe.getClearColor())},this.setClearColor=function(){xe.setClearColor(...arguments)},this.getClearAlpha=function(){return xe.getClearAlpha()},this.setClearAlpha=function(){xe.setClearAlpha(...arguments)},this.clear=function(E=!0,L=!0,O=!0){let Q=0;if(E){let P=!1;if(F!==null){let j=F.texture.format;P=j===ma||j===Aa||j===pa}if(P){let j=F.texture.type,ce=j===Ue||j===ki||j===nr||j===ir||j===da||j===fa,Ae=xe.getClearColor(),ue=xe.getClearAlpha(),we=Ae.r,Be=Ae.g,Ie=Ae.b;ce?(p[0]=we,p[1]=Be,p[2]=Ie,p[3]=ue,b.clearBufferuiv(b.COLOR,0,p)):(g[0]=we,g[1]=Be,g[2]=Ie,g[3]=ue,b.clearBufferiv(b.COLOR,0,g))}else Q|=b.COLOR_BUFFER_BIT}L&&(Q|=b.DEPTH_BUFFER_BIT),O&&(Q|=b.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),b.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",se,!1),t.removeEventListener("webglcontextrestored",de,!1),t.removeEventListener("webglcontextcreationerror",Z,!1),xe.dispose(),z.dispose(),Me.dispose(),_e.dispose(),Ft.dispose(),vt.dispose(),N.dispose(),ae.dispose(),Qe.dispose(),W.dispose(),te.dispose(),te.removeEventListener("sessionstart",Un),te.removeEventListener("sessionend",mh),Xi.stop()};function se(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function de(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;let E=pt.autoReset,L=Ee.enabled,O=Ee.autoUpdate,Q=Ee.needsUpdate,P=Ee.type;D(),pt.autoReset=E,Ee.enabled=L,Ee.autoUpdate=O,Ee.needsUpdate=Q,Ee.type=P}function Z(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function q(E){let L=E.target;L.removeEventListener("dispose",q),me(L)}function me(E){Le(E),_e.remove(E)}function Le(E){let L=_e.get(E).programs;L!==void 0&&(L.forEach(function(O){W.releaseProgram(O)}),E.isShaderMaterial&&W.releaseShaderCache(E))}this.renderBufferDirect=function(E,L,O,Q,P,j){L===null&&(L=Ce);let ce=P.isMesh&&P.matrixWorld.determinant()<0,Ae=sp(E,L,O,Q,P);ge.setMaterial(Q,ce);let ue=O.index,we=1;if(Q.wireframe===!0){if(ue=_.getWireframeAttribute(O),ue===void 0)return;we=2}let Be=O.drawRange,Ie=O.attributes.position,Xe=Be.start*we,ot=(Be.start+Be.count)*we;j!==null&&(Xe=Math.max(Xe,j.start*we),ot=Math.min(ot,(j.start+j.count)*we)),ue!==null?(Xe=Math.max(Xe,0),ot=Math.min(ot,ue.count)):Ie!=null&&(Xe=Math.max(Xe,0),ot=Math.min(ot,Ie.count));let yt=ot-Xe;if(yt<0||yt===1/0)return;ae.setup(P,Q,Ae,O,ue);let dt,ct=he;if(ue!==null&&(dt=S.get(ue),ct=be,ct.setIndex(dt)),P.isMesh)Q.wireframe===!0?(ge.setLineWidth(Q.wireframeLinewidth*Gt()),ct.setMode(b.LINES)):ct.setMode(b.TRIANGLES);else if(P.isLine){let Te=Q.linewidth;Te===void 0&&(Te=1),ge.setLineWidth(Te*Gt()),P.isLineSegments?ct.setMode(b.LINES):P.isLineLoop?ct.setMode(b.LINE_LOOP):ct.setMode(b.LINE_STRIP)}else P.isPoints?ct.setMode(b.POINTS):P.isSprite&&ct.setMode(b.TRIANGLES);if(P.isBatchedMesh)if(P._multiDrawInstances!==null)Gs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ct.renderMultiDrawInstances(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount,P._multiDrawInstances);else if(Ne.get("WEBGL_multi_draw"))ct.renderMultiDraw(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount);else{let Te=P._multiDrawStarts,mt=P._multiDrawCounts,je=P._multiDrawCount,ln=ue?S.get(ue).bytesPerElement:1,xs=_e.get(Q).currentProgram.getUniforms();for(let hn=0;hn<je;hn++)xs.setValue(b,"_gl_DrawID",hn),ct.render(Te[hn]/ln,mt[hn])}else if(P.isInstancedMesh)ct.renderInstances(Xe,yt,P.count);else if(O.isInstancedBufferGeometry){let Te=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,mt=Math.min(O.instanceCount,Te);ct.renderInstances(Xe,yt,mt)}else ct.render(Xe,yt)};function ut(E,L,O){E.transparent===!0&&E.side===on&&E.forceSinglePass===!1?(E.side=Pt,E.needsUpdate=!0,uo(E,L,O),E.side=Fn,E.needsUpdate=!0,uo(E,L,O),E.side=on):uo(E,L,O)}this.compile=function(E,L,O=null){O===null&&(O=E),A=Me.get(O),A.init(L),v.push(A),O.traverseVisible(function(P){P.isLight&&P.layers.test(L.layers)&&(A.pushLight(P),P.castShadow&&A.pushShadow(P))}),E!==O&&E.traverseVisible(function(P){P.isLight&&P.layers.test(L.layers)&&(A.pushLight(P),P.castShadow&&A.pushShadow(P))}),A.setupLights();let Q=new Set;return E.traverse(function(P){if(!(P.isMesh||P.isPoints||P.isLine||P.isSprite))return;let j=P.material;if(j)if(Array.isArray(j))for(let ce=0;ce<j.length;ce++){let Ae=j[ce];ut(Ae,O,P),Q.add(Ae)}else ut(j,O,P),Q.add(j)}),A=v.pop(),Q},this.compileAsync=function(E,L,O=null){let Q=this.compile(E,L,O);return new Promise(P=>{function j(){if(Q.forEach(function(ce){_e.get(ce).currentProgram.isReady()&&Q.delete(ce)}),Q.size===0){P(E);return}setTimeout(j,10)}Ne.get("KHR_parallel_shader_compile")!==null?j():setTimeout(j,10)})};let tt=null;function jn(E){tt&&tt(E)}function Un(){Xi.stop()}function mh(){Xi.start()}let Xi=new xd;Xi.setAnimationLoop(jn),typeof self<"u"&&Xi.setContext(self),this.setAnimationLoop=function(E){tt=E,te.setAnimationLoop(E),E===null?Xi.stop():Xi.start()},te.addEventListener("sessionstart",Un),te.addEventListener("sessionend",mh),this.render=function(E,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(L),L=te.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,L,F),A=Me.get(E,v.length),A.init(L),v.push(A),J.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),st.setFromProjectionMatrix(J,Bn,L.reversedDepth),X=this.localClippingEnabled,et=ne.init(this.clippingPlanes,X),m=z.get(E,x.length),m.init(),x.push(m),te.enabled===!0&&te.isPresenting===!0){let j=y.xr.getDepthSensingMesh();j!==null&&Za(j,L,-1/0,y.sortObjects)}Za(E,L,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(ie,le),Ye=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Ye&&xe.addToRenderList(m,E),this.info.render.frame++,et===!0&&ne.beginShadows();let O=A.state.shadowsArray;Ee.render(O,E,L),et===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();let Q=m.opaque,P=m.transmissive;if(A.setupLights(),L.isArrayCamera){let j=L.cameras;if(P.length>0)for(let ce=0,Ae=j.length;ce<Ae;ce++){let ue=j[ce];_h(Q,P,E,ue)}Ye&&xe.render(E);for(let ce=0,Ae=j.length;ce<Ae;ce++){let ue=j[ce];gh(m,E,ue,ue.viewport)}}else P.length>0&&_h(Q,P,E,L),Ye&&xe.render(E),gh(m,E,L);F!==null&&R===0&&(ke.updateMultisampleRenderTarget(F),ke.updateRenderTargetMipmap(F)),E.isScene===!0&&E.onAfterRender(y,E,L),ae.resetDefaultState(),C=-1,M=null,v.pop(),v.length>0?(A=v[v.length-1],et===!0&&ne.setGlobalState(y.clippingPlanes,A.state.camera)):A=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Za(E,L,O,Q){if(E.visible===!1)return;if(E.layers.test(L.layers)){if(E.isGroup)O=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(L);else if(E.isLight)A.pushLight(E),E.castShadow&&A.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||st.intersectsSprite(E)){Q&&De.setFromMatrixPosition(E.matrixWorld).applyMatrix4(J);let ce=N.update(E),Ae=E.material;Ae.visible&&m.push(E,ce,Ae,O,De.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||st.intersectsObject(E))){let ce=N.update(E),Ae=E.material;if(Q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),De.copy(E.boundingSphere.center)):(ce.boundingSphere===null&&ce.computeBoundingSphere(),De.copy(ce.boundingSphere.center)),De.applyMatrix4(E.matrixWorld).applyMatrix4(J)),Array.isArray(Ae)){let ue=ce.groups;for(let we=0,Be=ue.length;we<Be;we++){let Ie=ue[we],Xe=Ae[Ie.materialIndex];Xe&&Xe.visible&&m.push(E,ce,Xe,O,De.z,Ie)}}else Ae.visible&&m.push(E,ce,Ae,O,De.z,null)}}let j=E.children;for(let ce=0,Ae=j.length;ce<Ae;ce++)Za(j[ce],L,O,Q)}function gh(E,L,O,Q){let P=E.opaque,j=E.transmissive,ce=E.transparent;A.setupLightsView(O),et===!0&&ne.setGlobalState(y.clippingPlanes,O),Q&&ge.viewport(B.copy(Q)),P.length>0&&ho(P,L,O),j.length>0&&ho(j,L,O),ce.length>0&&ho(ce,L,O),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function _h(E,L,O,Q){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;A.state.transmissionRenderTarget[Q.id]===void 0&&(A.state.transmissionRenderTarget[Q.id]=new fn(1,1,{generateMipmaps:!0,type:Ne.has("EXT_color_buffer_half_float")||Ne.has("EXT_color_buffer_float")?Xt:Ue,minFilter:Kt,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:We.workingColorSpace}));let j=A.state.transmissionRenderTarget[Q.id],ce=Q.viewport||B;j.setSize(ce.z*y.transmissionResolutionScale,ce.w*y.transmissionResolutionScale);let Ae=y.getRenderTarget(),ue=y.getActiveCubeFace(),we=y.getActiveMipmapLevel();y.setRenderTarget(j),y.getClearColor(H),K=y.getClearAlpha(),K<1&&y.setClearColor(16777215,.5),y.clear(),Ye&&xe.render(O);let Be=y.toneMapping;y.toneMapping=mi;let Ie=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),A.setupLightsView(Q),et===!0&&ne.setGlobalState(y.clippingPlanes,Q),ho(E,O,Q),ke.updateMultisampleRenderTarget(j),ke.updateRenderTargetMipmap(j),Ne.has("WEBGL_multisampled_render_to_texture")===!1){let Xe=!1;for(let ot=0,yt=L.length;ot<yt;ot++){let dt=L[ot],ct=dt.object,Te=dt.geometry,mt=dt.material,je=dt.group;if(mt.side===on&&ct.layers.test(Q.layers)){let ln=mt.side;mt.side=Pt,mt.needsUpdate=!0,yh(ct,O,Q,Te,mt,je),mt.side=ln,mt.needsUpdate=!0,Xe=!0}}Xe===!0&&(ke.updateMultisampleRenderTarget(j),ke.updateRenderTargetMipmap(j))}y.setRenderTarget(Ae,ue,we),y.setClearColor(H,K),Ie!==void 0&&(Q.viewport=Ie),y.toneMapping=Be}function ho(E,L,O){let Q=L.isScene===!0?L.overrideMaterial:null;for(let P=0,j=E.length;P<j;P++){let ce=E[P],Ae=ce.object,ue=ce.geometry,we=ce.group,Be=ce.material;Be.allowOverride===!0&&Q!==null&&(Be=Q),Ae.layers.test(O.layers)&&yh(Ae,L,O,ue,Be,we)}}function yh(E,L,O,Q,P,j){E.onBeforeRender(y,L,O,Q,P,j),E.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),P.onBeforeRender(y,L,O,Q,E,j),P.transparent===!0&&P.side===on&&P.forceSinglePass===!1?(P.side=Pt,P.needsUpdate=!0,y.renderBufferDirect(O,L,Q,P,E,j),P.side=Fn,P.needsUpdate=!0,y.renderBufferDirect(O,L,Q,P,E,j),P.side=on):y.renderBufferDirect(O,L,Q,P,E,j),E.onAfterRender(y,L,O,Q,P,j)}function uo(E,L,O){L.isScene!==!0&&(L=Ce);let Q=_e.get(E),P=A.state.lights,j=A.state.shadowsArray,ce=P.state.version,Ae=W.getParameters(E,P.state,j,L,O),ue=W.getProgramCacheKey(Ae),we=Q.programs;Q.environment=E.isMeshStandardMaterial?L.environment:null,Q.fog=L.fog,Q.envMap=(E.isMeshStandardMaterial?vt:Ft).get(E.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&E.envMap===null?L.environmentRotation:E.envMapRotation,we===void 0&&(E.addEventListener("dispose",q),we=new Map,Q.programs=we);let Be=we.get(ue);if(Be!==void 0){if(Q.currentProgram===Be&&Q.lightsStateVersion===ce)return xh(E,Ae),Be}else Ae.uniforms=W.getUniforms(E),E.onBeforeCompile(Ae,y),Be=W.acquireProgram(Ae,ue),we.set(ue,Be),Q.uniforms=Ae.uniforms;let Ie=Q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ie.clippingPlanes=ne.uniform),xh(E,Ae),Q.needsLights=op(E),Q.lightsStateVersion=ce,Q.needsLights&&(Ie.ambientLightColor.value=P.state.ambient,Ie.lightProbe.value=P.state.probe,Ie.directionalLights.value=P.state.directional,Ie.directionalLightShadows.value=P.state.directionalShadow,Ie.spotLights.value=P.state.spot,Ie.spotLightShadows.value=P.state.spotShadow,Ie.rectAreaLights.value=P.state.rectArea,Ie.ltc_1.value=P.state.rectAreaLTC1,Ie.ltc_2.value=P.state.rectAreaLTC2,Ie.pointLights.value=P.state.point,Ie.pointLightShadows.value=P.state.pointShadow,Ie.hemisphereLights.value=P.state.hemi,Ie.directionalShadowMap.value=P.state.directionalShadowMap,Ie.directionalShadowMatrix.value=P.state.directionalShadowMatrix,Ie.spotShadowMap.value=P.state.spotShadowMap,Ie.spotLightMatrix.value=P.state.spotLightMatrix,Ie.spotLightMap.value=P.state.spotLightMap,Ie.pointShadowMap.value=P.state.pointShadowMap,Ie.pointShadowMatrix.value=P.state.pointShadowMatrix),Q.currentProgram=Be,Q.uniformsList=null,Be}function Eh(E){if(E.uniformsList===null){let L=E.currentProgram.getUniforms();E.uniformsList=gr.seqWithValue(L.seq,E.uniforms)}return E.uniformsList}function xh(E,L){let O=_e.get(E);O.outputColorSpace=L.outputColorSpace,O.batching=L.batching,O.batchingColor=L.batchingColor,O.instancing=L.instancing,O.instancingColor=L.instancingColor,O.instancingMorph=L.instancingMorph,O.skinning=L.skinning,O.morphTargets=L.morphTargets,O.morphNormals=L.morphNormals,O.morphColors=L.morphColors,O.morphTargetsCount=L.morphTargetsCount,O.numClippingPlanes=L.numClippingPlanes,O.numIntersection=L.numClipIntersection,O.vertexAlphas=L.vertexAlphas,O.vertexTangents=L.vertexTangents,O.toneMapping=L.toneMapping}function sp(E,L,O,Q,P){L.isScene!==!0&&(L=Ce),ke.resetTextureUnits();let j=L.fog,ce=Q.isMeshStandardMaterial?L.environment:null,Ae=F===null?y.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:wt,ue=(Q.isMeshStandardMaterial?vt:Ft).get(Q.envMap||ce),we=Q.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Be=!!O.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Ie=!!O.morphAttributes.position,Xe=!!O.morphAttributes.normal,ot=!!O.morphAttributes.color,yt=mi;Q.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(yt=y.toneMapping);let dt=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ct=dt!==void 0?dt.length:0,Te=_e.get(Q),mt=A.state.lights;if(et===!0&&(X===!0||E!==M)){let Yt=E===M&&Q.id===C;ne.setState(Q,E,Yt)}let je=!1;Q.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==mt.state.version||Te.outputColorSpace!==Ae||P.isBatchedMesh&&Te.batching===!1||!P.isBatchedMesh&&Te.batching===!0||P.isBatchedMesh&&Te.batchingColor===!0&&P.colorTexture===null||P.isBatchedMesh&&Te.batchingColor===!1&&P.colorTexture!==null||P.isInstancedMesh&&Te.instancing===!1||!P.isInstancedMesh&&Te.instancing===!0||P.isSkinnedMesh&&Te.skinning===!1||!P.isSkinnedMesh&&Te.skinning===!0||P.isInstancedMesh&&Te.instancingColor===!0&&P.instanceColor===null||P.isInstancedMesh&&Te.instancingColor===!1&&P.instanceColor!==null||P.isInstancedMesh&&Te.instancingMorph===!0&&P.morphTexture===null||P.isInstancedMesh&&Te.instancingMorph===!1&&P.morphTexture!==null||Te.envMap!==ue||Q.fog===!0&&Te.fog!==j||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==ne.numPlanes||Te.numIntersection!==ne.numIntersection)||Te.vertexAlphas!==we||Te.vertexTangents!==Be||Te.morphTargets!==Ie||Te.morphNormals!==Xe||Te.morphColors!==ot||Te.toneMapping!==yt||Te.morphTargetsCount!==ct)&&(je=!0):(je=!0,Te.__version=Q.version);let ln=Te.currentProgram;je===!0&&(ln=uo(Q,L,P));let xs=!1,hn=!1,Cr=!1,gt=ln.getUniforms(),mn=Te.uniforms;if(ge.useProgram(ln.program)&&(xs=!0,hn=!0,Cr=!0),Q.id!==C&&(C=Q.id,hn=!0),xs||M!==E){ge.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),gt.setValue(b,"projectionMatrix",E.projectionMatrix),gt.setValue(b,"viewMatrix",E.matrixWorldInverse);let $t=gt.map.cameraPosition;$t!==void 0&&$t.setValue(b,pe.setFromMatrixPosition(E.matrixWorld)),Re.logarithmicDepthBuffer&&gt.setValue(b,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&gt.setValue(b,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,hn=!0,Cr=!0)}if(P.isSkinnedMesh){gt.setOptional(b,P,"bindMatrix"),gt.setOptional(b,P,"bindMatrixInverse");let Yt=P.skeleton;Yt&&(Yt.boneTexture===null&&Yt.computeBoneTexture(),gt.setValue(b,"boneTexture",Yt.boneTexture,ke))}P.isBatchedMesh&&(gt.setOptional(b,P,"batchingTexture"),gt.setValue(b,"batchingTexture",P._matricesTexture,ke),gt.setOptional(b,P,"batchingIdTexture"),gt.setValue(b,"batchingIdTexture",P._indirectTexture,ke),gt.setOptional(b,P,"batchingColorTexture"),P._colorsTexture!==null&&gt.setValue(b,"batchingColorTexture",P._colorsTexture,ke));let gn=O.morphAttributes;if((gn.position!==void 0||gn.normal!==void 0||gn.color!==void 0)&&ee.update(P,O,ln),(hn||Te.receiveShadow!==P.receiveShadow)&&(Te.receiveShadow=P.receiveShadow,gt.setValue(b,"receiveShadow",P.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(mn.envMap.value=ue,mn.flipEnvMap.value=ue.isCubeTexture&&ue.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&L.environment!==null&&(mn.envMapIntensity.value=L.environmentIntensity),hn&&(gt.setValue(b,"toneMappingExposure",y.toneMappingExposure),Te.needsLights&&rp(mn,Cr),j&&Q.fog===!0&&Y.refreshFogUniforms(mn,j),Y.refreshMaterialUniforms(mn,Q,G,$,A.state.transmissionRenderTarget[E.id]),gr.upload(b,Eh(Te),mn,ke)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(gr.upload(b,Eh(Te),mn,ke),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&gt.setValue(b,"center",P.center),gt.setValue(b,"modelViewMatrix",P.modelViewMatrix),gt.setValue(b,"normalMatrix",P.normalMatrix),gt.setValue(b,"modelMatrix",P.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){let Yt=Q.uniformsGroups;for(let $t=0,ja=Yt.length;$t<ja;$t++){let qi=Yt[$t];Qe.update(qi,ln),Qe.bind(qi,ln)}}return ln}function rp(E,L){E.ambientLightColor.needsUpdate=L,E.lightProbe.needsUpdate=L,E.directionalLights.needsUpdate=L,E.directionalLightShadows.needsUpdate=L,E.pointLights.needsUpdate=L,E.pointLightShadows.needsUpdate=L,E.spotLights.needsUpdate=L,E.spotLightShadows.needsUpdate=L,E.rectAreaLights.needsUpdate=L,E.hemisphereLights.needsUpdate=L}function op(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(E,L,O){let Q=_e.get(E);Q.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),_e.get(E.texture).__webglTexture=L,_e.get(E.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:O,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,L){let O=_e.get(E);O.__webglFramebuffer=L,O.__useDefaultFramebuffer=L===void 0};let ap=b.createFramebuffer();this.setRenderTarget=function(E,L=0,O=0){F=E,T=L,R=O;let Q=!0,P=null,j=!1,ce=!1;if(E){let ue=_e.get(E);if(ue.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(b.FRAMEBUFFER,null),Q=!1;else if(ue.__webglFramebuffer===void 0)ke.setupRenderTarget(E);else if(ue.__hasExternalTextures)ke.rebindTextures(E,_e.get(E.texture).__webglTexture,_e.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Ie=E.depthTexture;if(ue.__boundDepthTexture!==Ie){if(Ie!==null&&_e.has(Ie)&&(E.width!==Ie.image.width||E.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ke.setupDepthRenderbuffer(E)}}let we=E.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(ce=!0);let Be=_e.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Be[L])?P=Be[L][O]:P=Be[L],j=!0):E.samples>0&&ke.useMultisampledRTT(E)===!1?P=_e.get(E).__webglMultisampledFramebuffer:Array.isArray(Be)?P=Be[O]:P=Be,B.copy(E.viewport),U.copy(E.scissor),k=E.scissorTest}else B.copy(re).multiplyScalar(G).floor(),U.copy(ye).multiplyScalar(G).floor(),k=ze;if(O!==0&&(P=ap),ge.bindFramebuffer(b.FRAMEBUFFER,P)&&Q&&ge.drawBuffers(E,P),ge.viewport(B),ge.scissor(U),ge.setScissorTest(k),j){let ue=_e.get(E.texture);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_CUBE_MAP_POSITIVE_X+L,ue.__webglTexture,O)}else if(ce){let ue=L;for(let we=0;we<E.textures.length;we++){let Be=_e.get(E.textures[we]);b.framebufferTextureLayer(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0+we,Be.__webglTexture,O,ue)}}else if(E!==null&&O!==0){let ue=_e.get(E.texture);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,ue.__webglTexture,O)}C=-1},this.readRenderTargetPixels=function(E,L,O,Q,P,j,ce,Ae=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=_e.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ce!==void 0&&(ue=ue[ce]),ue){ge.bindFramebuffer(b.FRAMEBUFFER,ue);try{let we=E.textures[Ae],Be=we.format,Ie=we.type;if(!Re.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Re.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=E.width-Q&&O>=0&&O<=E.height-P&&(E.textures.length>1&&b.readBuffer(b.COLOR_ATTACHMENT0+Ae),b.readPixels(L,O,Q,P,ve.convert(Be),ve.convert(Ie),j))}finally{let we=F!==null?_e.get(F).__webglFramebuffer:null;ge.bindFramebuffer(b.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(E,L,O,Q,P,j,ce,Ae=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=_e.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ce!==void 0&&(ue=ue[ce]),ue)if(L>=0&&L<=E.width-Q&&O>=0&&O<=E.height-P){ge.bindFramebuffer(b.FRAMEBUFFER,ue);let we=E.textures[Ae],Be=we.format,Ie=we.type;if(!Re.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Re.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Xe=b.createBuffer();b.bindBuffer(b.PIXEL_PACK_BUFFER,Xe),b.bufferData(b.PIXEL_PACK_BUFFER,j.byteLength,b.STREAM_READ),E.textures.length>1&&b.readBuffer(b.COLOR_ATTACHMENT0+Ae),b.readPixels(L,O,Q,P,ve.convert(Be),ve.convert(Ie),0);let ot=F!==null?_e.get(F).__webglFramebuffer:null;ge.bindFramebuffer(b.FRAMEBUFFER,ot);let yt=b.fenceSync(b.SYNC_GPU_COMMANDS_COMPLETE,0);return b.flush(),await Xu(b,yt,4),b.bindBuffer(b.PIXEL_PACK_BUFFER,Xe),b.getBufferSubData(b.PIXEL_PACK_BUFFER,0,j),b.deleteBuffer(Xe),b.deleteSync(yt),j}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,L=null,O=0){let Q=Math.pow(2,-O),P=Math.floor(E.image.width*Q),j=Math.floor(E.image.height*Q),ce=L!==null?L.x:0,Ae=L!==null?L.y:0;ke.setTexture2D(E,0),b.copyTexSubImage2D(b.TEXTURE_2D,O,0,0,ce,Ae,P,j),ge.unbindTexture()};let cp=b.createFramebuffer(),lp=b.createFramebuffer();this.copyTextureToTexture=function(E,L,O=null,Q=null,P=0,j=null){j===null&&(P!==0?(Gs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),j=P,P=0):j=0);let ce,Ae,ue,we,Be,Ie,Xe,ot,yt,dt=E.isCompressedTexture?E.mipmaps[j]:E.image;if(O!==null)ce=O.max.x-O.min.x,Ae=O.max.y-O.min.y,ue=O.isBox3?O.max.z-O.min.z:1,we=O.min.x,Be=O.min.y,Ie=O.isBox3?O.min.z:0;else{let gn=Math.pow(2,-P);ce=Math.floor(dt.width*gn),Ae=Math.floor(dt.height*gn),E.isDataArrayTexture?ue=dt.depth:E.isData3DTexture?ue=Math.floor(dt.depth*gn):ue=1,we=0,Be=0,Ie=0}Q!==null?(Xe=Q.x,ot=Q.y,yt=Q.z):(Xe=0,ot=0,yt=0);let ct=ve.convert(L.format),Te=ve.convert(L.type),mt;L.isData3DTexture?(ke.setTexture3D(L,0),mt=b.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(ke.setTexture2DArray(L,0),mt=b.TEXTURE_2D_ARRAY):(ke.setTexture2D(L,0),mt=b.TEXTURE_2D),b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL,L.flipY),b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),b.pixelStorei(b.UNPACK_ALIGNMENT,L.unpackAlignment);let je=b.getParameter(b.UNPACK_ROW_LENGTH),ln=b.getParameter(b.UNPACK_IMAGE_HEIGHT),xs=b.getParameter(b.UNPACK_SKIP_PIXELS),hn=b.getParameter(b.UNPACK_SKIP_ROWS),Cr=b.getParameter(b.UNPACK_SKIP_IMAGES);b.pixelStorei(b.UNPACK_ROW_LENGTH,dt.width),b.pixelStorei(b.UNPACK_IMAGE_HEIGHT,dt.height),b.pixelStorei(b.UNPACK_SKIP_PIXELS,we),b.pixelStorei(b.UNPACK_SKIP_ROWS,Be),b.pixelStorei(b.UNPACK_SKIP_IMAGES,Ie);let gt=E.isDataArrayTexture||E.isData3DTexture,mn=L.isDataArrayTexture||L.isData3DTexture;if(E.isDepthTexture){let gn=_e.get(E),Yt=_e.get(L),$t=_e.get(gn.__renderTarget),ja=_e.get(Yt.__renderTarget);ge.bindFramebuffer(b.READ_FRAMEBUFFER,$t.__webglFramebuffer),ge.bindFramebuffer(b.DRAW_FRAMEBUFFER,ja.__webglFramebuffer);for(let qi=0;qi<ue;qi++)gt&&(b.framebufferTextureLayer(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,_e.get(E).__webglTexture,P,Ie+qi),b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,_e.get(L).__webglTexture,j,yt+qi)),b.blitFramebuffer(we,Be,ce,Ae,Xe,ot,ce,Ae,b.DEPTH_BUFFER_BIT,b.NEAREST);ge.bindFramebuffer(b.READ_FRAMEBUFFER,null),ge.bindFramebuffer(b.DRAW_FRAMEBUFFER,null)}else if(P!==0||E.isRenderTargetTexture||_e.has(E)){let gn=_e.get(E),Yt=_e.get(L);ge.bindFramebuffer(b.READ_FRAMEBUFFER,cp),ge.bindFramebuffer(b.DRAW_FRAMEBUFFER,lp);for(let $t=0;$t<ue;$t++)gt?b.framebufferTextureLayer(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,gn.__webglTexture,P,Ie+$t):b.framebufferTexture2D(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,gn.__webglTexture,P),mn?b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,Yt.__webglTexture,j,yt+$t):b.framebufferTexture2D(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,Yt.__webglTexture,j),P!==0?b.blitFramebuffer(we,Be,ce,Ae,Xe,ot,ce,Ae,b.COLOR_BUFFER_BIT,b.NEAREST):mn?b.copyTexSubImage3D(mt,j,Xe,ot,yt+$t,we,Be,ce,Ae):b.copyTexSubImage2D(mt,j,Xe,ot,we,Be,ce,Ae);ge.bindFramebuffer(b.READ_FRAMEBUFFER,null),ge.bindFramebuffer(b.DRAW_FRAMEBUFFER,null)}else mn?E.isDataTexture||E.isData3DTexture?b.texSubImage3D(mt,j,Xe,ot,yt,ce,Ae,ue,ct,Te,dt.data):L.isCompressedArrayTexture?b.compressedTexSubImage3D(mt,j,Xe,ot,yt,ce,Ae,ue,ct,dt.data):b.texSubImage3D(mt,j,Xe,ot,yt,ce,Ae,ue,ct,Te,dt):E.isDataTexture?b.texSubImage2D(b.TEXTURE_2D,j,Xe,ot,ce,Ae,ct,Te,dt.data):E.isCompressedTexture?b.compressedTexSubImage2D(b.TEXTURE_2D,j,Xe,ot,dt.width,dt.height,ct,dt.data):b.texSubImage2D(b.TEXTURE_2D,j,Xe,ot,ce,Ae,ct,Te,dt);b.pixelStorei(b.UNPACK_ROW_LENGTH,je),b.pixelStorei(b.UNPACK_IMAGE_HEIGHT,ln),b.pixelStorei(b.UNPACK_SKIP_PIXELS,xs),b.pixelStorei(b.UNPACK_SKIP_ROWS,hn),b.pixelStorei(b.UNPACK_SKIP_IMAGES,Cr),j===0&&L.generateMipmaps&&b.generateMipmap(mt),ge.unbindTexture()},this.initRenderTarget=function(E){_e.get(E).__webglFramebuffer===void 0&&ke.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?ke.setTextureCube(E,0):E.isData3DTexture?ke.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?ke.setTexture2DArray(E,0):ke.setTexture2D(E,0),ge.unbindTexture()},this.resetState=function(){T=0,R=0,F=null,ge.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=We._getDrawingBufferColorSpace(e),t.unpackColorSpace=We._getUnpackColorSpace()}};function Td(s,e=!1){let t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,l=new Je,c=0;for(let h=0;h<s.length;++h){let d=s[h],f=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let u in d.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;r[u]===void 0&&(r[u]=[]),r[u].push(d.attributes[u]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let u in d.morphAttributes){if(!i.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[u]===void 0&&(o[u]=[]),o[u].push(d.morphAttributes[u])}if(e){let u;if(t)u=d.index.count;else if(d.attributes.position!==void 0)u=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,u,h),c+=u}}if(t){let h=0,d=[];for(let f=0;f<s.length;++f){let u=s[f].index;for(let p=0;p<u.count;++p)d.push(u.getX(p)+h);h+=s[f].attributes.position.count}l.setIndex(d)}for(let h in r){let d=Id(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in o){let d=o[h][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<d;++f){let u=[];for(let g=0;g<o[h].length;++g)u.push(o[h][g][f]);let p=Id(u);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}return l}function Id(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){let h=s[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Ge(o,t,n),l=0;for(let c=0;c<s.length;++c){let h=s[c];if(h.isInterleavedBufferAttribute){let d=l/t;for(let f=0,u=h.count;f<u;f++)for(let p=0;p<t;p++){let g=h.getComponent(f,p);a.setComponent(f+d,p,g)}}else o.set(h.array,l);l+=h.count*t}return i!==void 0&&(a.gpuType=i),a}function _l(s,e){if(e===Xc)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===pr||e===oo){let t=s.getIndex();if(t===null){let o=[],a=s.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);s.setIndex(o),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=t.count-2,i=[];if(e===pr)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}var vr=class extends vn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Sl(t)}),this.register(function(t){return new Il(t)}),this.register(function(t){return new Pl(t)}),this.register(function(t){return new Ul(t)}),this.register(function(t){return new Nl(t)}),this.register(function(t){return new wl(t)}),this.register(function(t){return new bl(t)}),this.register(function(t){return new Rl(t)}),this.register(function(t){return new Bl(t)}),this.register(function(t){return new Cl(t)}),this.register(function(t){return new Dl(t)}),this.register(function(t){return new Tl(t)}),this.register(function(t){return new Ll(t)}),this.register(function(t){return new Fl(t)}),this.register(function(t){return new vl(t)}),this.register(function(t){return new Ol(t)}),this.register(function(t){return new Ql(t)})}load(e,t,n,i){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=pi.extractUrlBase(e);o=pi.resolveURL(c,this.path)}else o=pi.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new zn(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(h){t(h),r.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r,o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Dd){try{o[Ke.KHR_BINARY_GLTF]=new kl(e)}catch(d){i&&i(d);return}r=JSON.parse(o[Ke.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Xl(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let d=this.pluginCallbacks[h](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let d=r.extensionsUsed[h],f=r.extensionsRequired||[];switch(d){case Ke.KHR_MATERIALS_UNLIT:o[d]=new Ml;break;case Ke.KHR_DRACO_MESH_COMPRESSION:o[d]=new Gl(r,this.dracoLoader);break;case Ke.KHR_TEXTURE_TRANSFORM:o[d]=new Hl;break;case Ke.KHR_MESH_QUANTIZATION:o[d]=new Vl;break;default:f.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}};function O0(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}var Ke={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},vl=class{constructor(e){this.parser=e,this.name=Ke.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new fe(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],wt);let d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Oi(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new os(h),c.distance=d;break;case"spot":c=new no(h),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Jn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}},Ml=class{constructor(){this.name=Ke.KHR_MATERIALS_UNLIT}getMaterialType(){return Ot}extendParams(e,t,n){let i=[];e.color=new fe(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],wt),e.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,nt))}return Promise.all(i)}},Cl=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},Sl=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Se(a,a)}return Promise.all(r)}},Il=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},Tl=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},wl=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[];t.sheenColor=new fe(0,0,0),t.sheenRoughness=0,t.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],wt)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,nt)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},bl=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},Rl=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return t.attenuationColor=new fe().setRGB(a[0],a[1],a[2],wt),Promise.all(r)}},Bl=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},Dl=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return t.specularColor=new fe().setRGB(a[0],a[1],a[2],wt),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,nt)),Promise.all(r)}},Fl=class{constructor(e){this.parser=e,this.name=Ke.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}},Ll=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:sn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},Pl=class{constructor(e){this.parser=e,this.name=Ke.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},Ul=class{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},Nl=class{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},Ol=class{constructor(e){this.name=Ke.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=i.byteOffset||0,c=i.byteLength||0,h=i.count,d=i.byteStride,f=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,d,f,i.mode,i.filter).then(function(u){return u.buffer}):o.ready.then(function(){let u=new ArrayBuffer(h*d);return o.decodeGltfBuffer(new Uint8Array(u),h,d,f,i.mode,i.filter),u})})}else return null}},Ql=class{constructor(e){this.name=Ke.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==Cn.TRIANGLES&&c.mode!==Cn.TRIANGLE_STRIP&&c.mode!==Cn.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(h=>(l[c]=h,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let h=c.pop(),d=h.isGroup?h.children:[h],f=c[0].count,u=[];for(let p of d){let g=new Oe,m=new w,A=new bt,x=new w(1,1,1),v=new Zt(p.geometry,p.material,f);for(let y=0;y<f;y++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,y),l.ROTATION&&A.fromBufferAttribute(l.ROTATION,y),l.SCALE&&x.fromBufferAttribute(l.SCALE,y),v.setMatrixAt(y,g.compose(m,A,x));for(let y in l)if(y==="_COLOR_0"){let I=l[y];v.instanceColor=new Fi(I.array,I.itemSize,I.normalized)}else y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"&&p.geometry.setAttribute(y,l[y]);qe.prototype.copy.call(v,p),this.parser.assignFinalMaterial(v),u.push(v)}return h.isGroup?(h.clear(),h.add(...u),h):u[0]}))}},Dd="glTF",co=12,wd={JSON:1313821514,BIN:5130562},kl=class{constructor(e){this.name=Ke.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,co),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Dd)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-co,r=new DataView(e,co),o=0;for(;o<i;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===wd.JSON){let c=new Uint8Array(e,co+o,a);this.content=n.decode(c)}else if(l===wd.BIN){let c=co+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Gl=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ke.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let h in o){let d=Wl[h]||h.toLowerCase();a[d]=o[h]}for(let h in e.attributes){let d=Wl[h]||h.toLowerCase();if(o[h]!==void 0){let f=n.accessors[e.attributes[h]],u=xr[f.componentType];c[d]=u.name,l[d]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(d,f){i.decodeDracoFile(h,function(u){for(let p in u.attributes){let g=u.attributes[p],m=l[p];m!==void 0&&(g.normalized=m)}d(u)},a,c,wt,f)})})}},Hl=class{constructor(){this.name=Ke.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},Vl=class{constructor(){this.name=Ke.KHR_MESH_QUANTIZATION}},Ua=class extends hi{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,h=i-t,d=(n-t)/h,f=d*d,u=f*d,p=e*c,g=p-c,m=-2*u+3*f,A=u-f,x=1-m,v=A-f+d;for(let y=0;y!==a;y++){let I=o[g+y+a],T=o[g+y+l]*h,R=o[p+y+a],F=o[p+y]*h;r[y]=x*I+v*T+m*R+A*F}return r}},Q0=new bt,zl=class extends Ua{interpolate_(e,t,n,i){let r=super.interpolate_(e,t,n,i);return Q0.fromArray(r).normalize().toArray(r),r}},Cn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},xr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},bd={9728:St,9729:Et,9984:er,9985:tr,9986:cs,9987:Kt},Rd={33071:Rn,33648:Ns,10497:On},yl={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Wl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ki={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},k0={CUBICSPLINE:void 0,LINEAR:ns,STEP:ts},El={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function G0(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new xn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Fn})),s.DefaultMaterial}function ys(s,e,t){for(let n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Jn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function H0(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(i=!0),d.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let o=[],a=[],l=[];for(let c=0,h=e.length;c<h;c++){let d=e[c];if(n){let f=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):s.attributes.position;o.push(f)}if(i){let f=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):s.attributes.normal;a.push(f)}if(r){let f=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):s.attributes.color;l.push(f)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let h=c[0],d=c[1],f=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=d),r&&(s.morphAttributes.color=f),s.morphTargetsRelative=!0,s})}function V0(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function z0(s){let e,t=s.extensions&&s.extensions[Ke.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+xl(t.attributes):e=s.indices+":"+xl(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+xl(s.targets[n]);return e}function xl(s){let e="",t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function Kl(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function W0(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var K0=new Oe,Xl=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new O0,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new $r(this.options.manager):this.textureLoader=new io(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new zn(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return ys(r,a,i),Jn(a,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){let o=t[i].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let i=0,r=e.length;i<r;i++){let o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,h]of o.children.entries())r(h,a.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ke.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,o){n.load(pi.resolveURL(t.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let o=yl[i.type],a=xr[i.componentType],l=i.normalized===!0,c=new a(i.count*o);return Promise.resolve(new Ge(c,o,l))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=yl[i.type],c=xr[i.componentType],h=c.BYTES_PER_ELEMENT,d=h*l,f=i.byteOffset||0,u=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,g,m;if(u&&u!==d){let A=Math.floor(f/u),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+A+":"+i.count,v=t.cache.get(x);v||(g=new c(a,A*u,i.count*u/h),v=new Ks(g,u/h),t.cache.add(x,v)),m=new Xs(v,l,f%u/h,p)}else a===null?g=new c(i.count*l):g=new c(a,f,i.count*l),m=new Ge(g,l,p);if(i.sparse!==void 0){let A=yl.SCALAR,x=xr[i.sparse.indices.componentType],v=i.sparse.indices.byteOffset||0,y=i.sparse.values.byteOffset||0,I=new x(o[1],v,i.sparse.count*A),T=new c(o[2],y,i.sparse.count*l);a!==null&&(m=new Ge(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,F=I.length;R<F;R++){let C=I[R];if(m.setX(C,T[R*l]),l>=2&&m.setY(C,T[R*l+1]),l>=3&&m.setZ(C,T[R*l+2]),l>=4&&m.setW(C,T[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let i=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let f=(r.samplers||{})[o.sampler]||{};return h.magFilter=bd[f.magFilter]||Et,h.minFilter=bd[f.minFilter]||Kt,h.wrapS=Rd[f.wrapS]||On,h.wrapT=Rd[f.wrapT]||On,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==St&&h.minFilter!==Et,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let o=i.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(d){c=!0;let f=new Blob([d],{type:o.mimeType});return l=a.createObjectURL(f),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(d){return new Promise(function(f,u){let p=f;t.isImageBitmapLoader===!0&&(p=function(g){let m=new It(g);m.needsUpdate=!0,f(m)}),t.load(pi.resolveURL(d,r.path),p,void 0,u)})}).then(function(d){return c===!0&&a.revokeObjectURL(l),Jn(d,o),d.userData.mimeType=o.mimeType||W0(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[Ke.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[Ke.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[Ke.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new Li,tn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new nn,tn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return xn}loadMaterial(e){let t=this,n=this.json,i=this.extensions,r=n.materials[e],o,a={},l=r.extensions||{},c=[];if(l[Ke.KHR_MATERIALS_UNLIT]){let d=i[Ke.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),c.push(d.extendParams(a,r,t))}else{let d=r.pbrMetallicRoughness||{};if(a.color=new fe(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){let f=d.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],wt),a.opacity=f[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",d.baseColorTexture,nt)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=on);let h=r.alphaMode||El.OPAQUE;if(h===El.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===El.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Ot&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Se(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;a.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&o!==Ot&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Ot){let d=r.emissiveFactor;a.emissive=new fe().setRGB(d[0],d[1],d[2],wt)}return r.emissiveTexture!==void 0&&o!==Ot&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,nt)),Promise.all(c).then(function(){let d=new o(a);return r.name&&(d.name=r.name),Jn(d,r),t.associations.set(d,{materials:e}),r.extensions&&ys(i,d,r),d})}createUniqueName(e){let t=lt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[Ke.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return Bd(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],h=z0(c),d=i[h];if(d)o.push(d.promise);else{let f;c.extensions&&c.extensions[Ke.KHR_DRACO_MESH_COMPRESSION]?f=r(c):f=Bd(new Je,c,t),i[h]={primitive:c,promise:f},o.push(f)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,i=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let h=o[l].material===void 0?G0(this.cache):this.getDependency("material",o[l].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],d=[];for(let u=0,p=h.length;u<p;u++){let g=h[u],m=o[u],A,x=c[u];if(m.mode===Cn.TRIANGLES||m.mode===Cn.TRIANGLE_STRIP||m.mode===Cn.TRIANGLE_FAN||m.mode===void 0)A=r.isSkinnedMesh===!0?new Hr(g,x):new At(g,x),A.isSkinnedMesh===!0&&A.normalizeSkinWeights(),m.mode===Cn.TRIANGLE_STRIP?A.geometry=_l(A.geometry,oo):m.mode===Cn.TRIANGLE_FAN&&(A.geometry=_l(A.geometry,pr));else if(m.mode===Cn.LINES)A=new pn(g,x);else if(m.mode===Cn.LINE_STRIP)A=new ss(g,x);else if(m.mode===Cn.LINE_LOOP)A=new zr(g,x);else if(m.mode===Cn.POINTS)A=new En(g,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(A.geometry.morphAttributes).length>0&&V0(A,r),A.name=t.createUniqueName(r.name||"mesh_"+e),Jn(A,r),m.extensions&&ys(i,A,m),t.assignFinalMaterial(A),d.push(A)}for(let u=0,p=d.length;u<p;u++)t.associations.set(d[u],{meshes:e,primitives:u});if(d.length===1)return r.extensions&&ys(i,d[0],r),d[0];let f=new zt;r.extensions&&ys(i,f,r),t.associations.set(f,{meshes:e});for(let u=0,p=d.length;u<p;u++)f.add(d[u]);return f})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Ct(qn.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new fi(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Jn(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),o=i,a=[],l=[];for(let c=0,h=o.length;c<h;c++){let d=o[c];if(d){a.push(d);let f=new Oe;r!==null&&f.fromArray(r.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Vr(a,l)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,o=[],a=[],l=[],c=[],h=[];for(let d=0,f=i.channels.length;d<f;d++){let u=i.channels[d],p=i.samplers[u.sampler],g=u.target,m=g.node,A=i.parameters!==void 0?i.parameters[p.input]:p.input,x=i.parameters!==void 0?i.parameters[p.output]:p.output;g.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",A)),l.push(this.getDependency("accessor",x)),c.push(p),h.push(g))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(d){let f=d[0],u=d[1],p=d[2],g=d[3],m=d[4],A=[];for(let v=0,y=f.length;v<y;v++){let I=f[v],T=u[v],R=p[v],F=g[v],C=m[v];if(I===void 0)continue;I.updateMatrix&&I.updateMatrix();let M=n._createAnimationTracks(I,T,R,F,C);if(M)for(let B=0;B<M.length;B++)A.push(M[B])}let x=new jr(r,void 0,A);return Jn(x,i),x})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=i.weights.length;l<c;l++)a.morphTargetInfluences[l]=i.weights[l]}),o})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=i.children||[];for(let c=0,h=a.length;c<h;c++)o.push(n.getDependency("node",a[c]));let l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let h=c[0],d=c[1],f=c[2];f!==null&&h.traverse(function(u){u.isSkinnedMesh&&u.bind(f,K0)});for(let u=0,p=d.length;u<p;u++)h.add(d[u]);return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?i.createUniqueName(r.name):"",a=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let h;if(r.isBone===!0?h=new qs:c.length>1?h=new zt:c.length===1?h=c[0]:h=new qe,h!==c[0])for(let d=0,f=c.length;d<f;d++)h.add(c[d]);if(r.name&&(h.userData.name=r.name,h.name=o),Jn(h,r),r.extensions&&ys(n,h,r),r.matrix!==void 0){let d=new Oe;d.fromArray(r.matrix),h.applyMatrix4(d)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){let d=i.associations.get(h);i.associations.set(h,{...d})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,r=new zt;n.name&&(r.name=i.createUniqueName(n.name)),Jn(r,n),n.extensions&&ys(t,r,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(i.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let h=0,d=l.length;h<d;h++)r.add(l[h]);let c=h=>{let d=new Map;for(let[f,u]of i.associations)(f instanceof tn||f instanceof It)&&d.set(f,u);return h.traverse(f=>{let u=i.associations.get(f);u!=null&&d.set(f,u)}),d};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){let o=[],a=e.name?e.name:e.uuid,l=[];Ki[r.path]===Ki.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(a);let c;switch(Ki[r.path]){case Ki.weights:c=Gn;break;case Ki.rotation:c=Hn;break;case Ki.translation:case Ki.scale:c=Vn;break;default:switch(n.itemSize){case 1:c=Gn;break;case 2:case 3:default:c=Vn;break}break}let h=i.interpolation!==void 0?k0[i.interpolation]:ns,d=this._getArrayFromAccessor(n);for(let f=0,u=l.length;f<u;f++){let p=new c(l[f]+"."+Ki[r.path],t.array,d,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(p),o.push(p)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Kl(t.constructor),i=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof Hn?zl:Ua;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function X0(s,e,t){let n=e.attributes,i=new Wt;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(i.set(new w(l[0],l[1],l[2]),new w(c[0],c[1],c[2])),a.normalized){let h=Kl(xr[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new w,l=new w;for(let c=0,h=r.length;c<h;c++){let d=r[c];if(d.POSITION!==void 0){let f=t.json.accessors[d.POSITION],u=f.min,p=f.max;if(u!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(u[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(u[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(u[2]),Math.abs(p[2]))),f.normalized){let g=Kl(xr[f.componentType]);l.multiplyScalar(g)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;let o=new en;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function Bd(s,e,t){let n=e.attributes,i=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){s.setAttribute(a,l)})}for(let o in n){let a=Wl[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(e.indices!==void 0&&!s.index){let o=t.getDependency("accessor",e.indices).then(function(a){s.setIndex(a)});i.push(o)}return We.workingColorSpace!==wt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${We.workingColorSpace}" not supported.`),Jn(s,e),X0(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?H0(s,e.targets,t):s})}var Na=class{constructor(e=4){this.pool=e,this.queue=[],this.workers=[],this.workersResolve=[],this.workerStatus=0,this.workerCreator=null}_initWorker(e){if(!this.workers[e]){let t=this.workerCreator();t.addEventListener("message",this._onMessage.bind(this,e)),this.workers[e]=t}}_getIdleWorker(){for(let e=0;e<this.pool;e++)if(!(this.workerStatus&1<<e))return e;return-1}_onMessage(e,t){let n=this.workersResolve[e];if(n&&n(t),this.queue.length){let{resolve:i,msg:r,transfer:o}=this.queue.shift();this.workersResolve[e]=i,this.workers[e].postMessage(r,o)}else this.workerStatus^=1<<e}setWorkerCreator(e){this.workerCreator=e}setWorkerLimit(e){this.pool=e}postMessage(e,t){return new Promise(n=>{let i=this._getIdleWorker();i!==-1?(this._initWorker(i),this.workerStatus|=1<<i,this.workersResolve[i]=n,this.workers[i].postMessage(e,t)):this.queue.push({resolve:n,msg:e,transfer:t})})}dispose(){this.workers.forEach(e=>e.terminate()),this.workersResolve.length=0,this.workers.length=0,this.queue.length=0,this.workerStatus=0}};var Es=class{constructor(e,t,n,i){this._dataView=void 0,this._littleEndian=void 0,this._offset=void 0,this._dataView=new DataView(e.buffer,e.byteOffset+t,n),this._littleEndian=i,this._offset=0}_nextUint8(){let e=this._dataView.getUint8(this._offset);return this._offset+=1,e}_nextUint16(){let e=this._dataView.getUint16(this._offset,this._littleEndian);return this._offset+=2,e}_nextUint32(){let e=this._dataView.getUint32(this._offset,this._littleEndian);return this._offset+=4,e}_nextUint64(){let e=this._dataView.getUint32(this._offset,this._littleEndian)+4294967296*this._dataView.getUint32(this._offset+4,this._littleEndian);return this._offset+=8,e}_nextInt32(){let e=this._dataView.getInt32(this._offset,this._littleEndian);return this._offset+=4,e}_nextUint8Array(e){let t=new Uint8Array(this._dataView.buffer,this._dataView.byteOffset+this._offset,e);return this._offset+=e,t}_skip(e){return this._offset+=e,this}_scan(e,t=0){let n=this._offset,i=0;for(;this._dataView.getUint8(this._offset)!==t&&i<e;)i++,this._offset++;return i<e&&this._offset++,new Uint8Array(this._dataView.buffer,this._dataView.byteOffset+n,i)}},Av=new Uint8Array([0]),jt=[171,75,84,88,32,50,48,187,13,10,26,10];function Fd(s){return new TextDecoder().decode(s)}function Ld(s){let e=new Uint8Array(s.buffer,s.byteOffset,jt.length);if(e[0]!==jt[0]||e[1]!==jt[1]||e[2]!==jt[2]||e[3]!==jt[3]||e[4]!==jt[4]||e[5]!==jt[5]||e[6]!==jt[6]||e[7]!==jt[7]||e[8]!==jt[8]||e[9]!==jt[9]||e[10]!==jt[10]||e[11]!==jt[11])throw new Error("Missing KTX 2.0 identifier.");let t={vkFormat:0,typeSize:1,pixelWidth:0,pixelHeight:0,pixelDepth:0,layerCount:0,faceCount:1,levelCount:0,supercompressionScheme:0,levels:[],dataFormatDescriptor:[{vendorId:0,descriptorType:0,versionNumber:2,colorModel:0,colorPrimaries:1,transferFunction:2,flags:0,texelBlockDimension:[0,0,0,0],bytesPlane:[0,0,0,0,0,0,0,0],samples:[]}],keyValue:{},globalData:null},n=17*Uint32Array.BYTES_PER_ELEMENT,i=new Es(s,jt.length,n,!0);t.vkFormat=i._nextUint32(),t.typeSize=i._nextUint32(),t.pixelWidth=i._nextUint32(),t.pixelHeight=i._nextUint32(),t.pixelDepth=i._nextUint32(),t.layerCount=i._nextUint32(),t.faceCount=i._nextUint32(),t.levelCount=i._nextUint32(),t.supercompressionScheme=i._nextUint32();let r=i._nextUint32(),o=i._nextUint32(),a=i._nextUint32(),l=i._nextUint32(),c=i._nextUint64(),h=i._nextUint64(),d=3*Math.max(t.levelCount,1)*8,f=new Es(s,jt.length+n,d,!0);for(let re=0,ye=Math.max(t.levelCount,1);re<ye;re++)t.levels.push({levelData:new Uint8Array(s.buffer,s.byteOffset+f._nextUint64(),f._nextUint64()),uncompressedByteLength:f._nextUint64()});let u=new Es(s,r,o,!0);u._skip(4);let p=u._nextUint16(),g=u._nextUint16(),m=u._nextUint16(),A=u._nextUint16(),x={vendorId:p,descriptorType:g,versionNumber:m,colorModel:u._nextUint8(),colorPrimaries:u._nextUint8(),transferFunction:u._nextUint8(),flags:u._nextUint8(),texelBlockDimension:[u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8()],bytesPlane:[u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8()],samples:[]},v=(A/4-6)/4;for(let re=0;re<v;re++){let ye={bitOffset:u._nextUint16(),bitLength:u._nextUint8(),channelType:u._nextUint8(),samplePosition:[u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8()],sampleLower:Number.NEGATIVE_INFINITY,sampleUpper:Number.POSITIVE_INFINITY};64&ye.channelType?(ye.sampleLower=u._nextInt32(),ye.sampleUpper=u._nextInt32()):(ye.sampleLower=u._nextUint32(),ye.sampleUpper=u._nextUint32()),x.samples[re]=ye}t.dataFormatDescriptor.length=0,t.dataFormatDescriptor.push(x);let y=new Es(s,a,l,!0);for(;y._offset<l;){let re=y._nextUint32(),ye=y._scan(re),ze=Fd(ye);if(t.keyValue[ze]=y._nextUint8Array(re-ye.byteLength-1),ze.match(/^ktx/i)){let st=Fd(t.keyValue[ze]);t.keyValue[ze]=st.substring(0,st.lastIndexOf("\0"))}y._skip(re%4?4-re%4:0)}if(h<=0)return t;let I=new Es(s,c,h,!0),T=I._nextUint16(),R=I._nextUint16(),F=I._nextUint32(),C=I._nextUint32(),M=I._nextUint32(),B=I._nextUint32(),U=[];for(let re=0,ye=Math.max(t.levelCount,1);re<ye;re++)U.push({imageFlags:I._nextUint32(),rgbSliceByteOffset:I._nextUint32(),rgbSliceByteLength:I._nextUint32(),alphaSliceByteOffset:I._nextUint32(),alphaSliceByteLength:I._nextUint32()});let k=c+I._offset,H=k+F,K=H+C,V=K+M,$=new Uint8Array(s.buffer,s.byteOffset+k,F),G=new Uint8Array(s.buffer,s.byteOffset+H,C),ie=new Uint8Array(s.buffer,s.byteOffset+K,M),le=new Uint8Array(s.buffer,s.byteOffset+V,B);return t.globalData={endpointCount:T,selectorCount:R,imageDescs:U,endpointsData:$,selectorsData:G,tablesData:ie,extendedData:le},t}var ql,Ei,Jl,Yl={env:{emscripten_notify_memory_growth:function(s){Jl=new Uint8Array(Ei.exports.memory.buffer)}}},Oa=class{init(){return ql||(ql=typeof fetch<"u"?fetch("data:application/wasm;base64,"+Pd).then(e=>e.arrayBuffer()).then(e=>WebAssembly.instantiate(e,Yl)).then(this._init):WebAssembly.instantiate(Buffer.from(Pd,"base64"),Yl).then(this._init),ql)}_init(e){Ei=e.instance,Yl.env.emscripten_notify_memory_growth(0)}decode(e,t=0){if(!Ei)throw new Error("ZSTDDecoder: Await .init() before decoding.");let n=e.byteLength,i=Ei.exports.malloc(n);Jl.set(e,i),t=t||Number(Ei.exports.ZSTD_findDecompressedSize(i,n));let r=Ei.exports.malloc(t),o=Ei.exports.ZSTD_decompress(r,t,i,n),a=Jl.slice(r,r+o);return Ei.exports.free(i),Ei.exports.free(r),a}},Pd="AGFzbQEAAAABpQEVYAF/AX9gAn9/AGADf39/AX9gBX9/f39/AX9gAX8AYAJ/fwF/YAR/f39/AX9gA39/fwBgBn9/f39/fwF/YAd/f39/f39/AX9gAn9/AX5gAn5+AX5gAABgBX9/f39/AGAGf39/f39/AGAIf39/f39/f38AYAl/f39/f39/f38AYAABf2AIf39/f39/f38Bf2ANf39/f39/f39/f39/fwF/YAF/AX4CJwEDZW52H2Vtc2NyaXB0ZW5fbm90aWZ5X21lbW9yeV9ncm93dGgABANpaAEFAAAFAgEFCwACAQABAgIFBQcAAwABDgsBAQcAEhMHAAUBDAQEAAANBwQCAgYCBAgDAwMDBgEACQkHBgICAAYGAgQUBwYGAwIGAAMCAQgBBwUGCgoEEQAEBAEIAwgDBQgDEA8IAAcABAUBcAECAgUEAQCAAgYJAX8BQaCgwAILB2AHBm1lbW9yeQIABm1hbGxvYwAoBGZyZWUAJgxaU1REX2lzRXJyb3IAaBlaU1REX2ZpbmREZWNvbXByZXNzZWRTaXplAFQPWlNURF9kZWNvbXByZXNzAEoGX3N0YXJ0ACQJBwEAQQELASQKussBaA8AIAAgACgCBCABajYCBAsZACAAKAIAIAAoAgRBH3F0QQAgAWtBH3F2CwgAIABBiH9LC34BBH9BAyEBIAAoAgQiA0EgTQRAIAAoAggiASAAKAIQTwRAIAAQDQ8LIAAoAgwiAiABRgRAQQFBAiADQSBJGw8LIAAgASABIAJrIANBA3YiBCABIARrIAJJIgEbIgJrIgQ2AgggACADIAJBA3RrNgIEIAAgBCgAADYCAAsgAQsUAQF/IAAgARACIQIgACABEAEgAgv3AQECfyACRQRAIABCADcCACAAQQA2AhAgAEIANwIIQbh/DwsgACABNgIMIAAgAUEEajYCECACQQRPBEAgACABIAJqIgFBfGoiAzYCCCAAIAMoAAA2AgAgAUF/ai0AACIBBEAgAEEIIAEQFGs2AgQgAg8LIABBADYCBEF/DwsgACABNgIIIAAgAS0AACIDNgIAIAJBfmoiBEEBTQRAIARBAWtFBEAgACABLQACQRB0IANyIgM2AgALIAAgAS0AAUEIdCADajYCAAsgASACakF/ai0AACIBRQRAIABBADYCBEFsDwsgAEEoIAEQFCACQQN0ams2AgQgAgsWACAAIAEpAAA3AAAgACABKQAINwAICy8BAX8gAUECdEGgHWooAgAgACgCAEEgIAEgACgCBGprQR9xdnEhAiAAIAEQASACCyEAIAFCz9bTvtLHq9lCfiAAfEIfiUKHla+vmLbem55/fgsdAQF/IAAoAgggACgCDEYEfyAAKAIEQSBGBUEACwuCBAEDfyACQYDAAE8EQCAAIAEgAhBnIAAPCyAAIAJqIQMCQCAAIAFzQQNxRQRAAkAgAkEBSARAIAAhAgwBCyAAQQNxRQRAIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADTw0BIAJBA3ENAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBQGshASACQUBrIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQALDAELIANBBEkEQCAAIQIMAQsgA0F8aiIEIABJBEAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCyACIANJBEADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAsMACAAIAEpAAA3AAALQQECfyAAKAIIIgEgACgCEEkEQEEDDwsgACAAKAIEIgJBB3E2AgQgACABIAJBA3ZrIgE2AgggACABKAAANgIAQQALDAAgACABKAIANgAAC/cCAQJ/AkAgACABRg0AAkAgASACaiAASwRAIAAgAmoiBCABSw0BCyAAIAEgAhALDwsgACABc0EDcSEDAkACQCAAIAFJBEAgAwRAIAAhAwwDCyAAQQNxRQRAIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcQ0ACwwBCwJAIAMNACAEQQNxBEADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAsMAgsgAkEDTQ0AIAIhBANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIARBfGoiBEEDSw0ACyACQQNxIQILIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAIajYCACADCy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAFajYCACADCx8AIAAgASACKAIEEAg2AgAgARAEGiAAIAJBCGo2AgQLCAAgAGdBH3MLugUBDX8jAEEQayIKJAACfyAEQQNNBEAgCkEANgIMIApBDGogAyAEEAsaIAAgASACIApBDGpBBBAVIgBBbCAAEAMbIAAgACAESxsMAQsgAEEAIAEoAgBBAXRBAmoQECENQVQgAygAACIGQQ9xIgBBCksNABogAiAAQQVqNgIAIAMgBGoiAkF8aiEMIAJBeWohDiACQXtqIRAgAEEGaiELQQQh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ASIDNgLE4AEgACgCvOABIQQgACABNgK84AEgACABIAJqNgK44AEgACABIAQgA2tqNgLA4AELpgEBAX8gACAAKALs4QEQFjYCyOABIABCADcD+OABIABCADcDuOABIABBwOABakIANwMAIABBqNAAaiIBQYyAgOAANgIAIABBADYCmOIBIABCADcDiOEBIABCAzcDgOEBIABBrNABakHgEikCADcCACAAQbTQAWpB6BIoAgA2AgAgACABNgIMIAAgAEGYIGo2AgggACAAQaAwajYCBCAAIABBEGo2AgALYQEBf0G4fyEDAkAgAUEDSQ0AIAIgABAhIgFBA3YiADYCCCACIAFBAXE2AgQgAiABQQF2QQNxIgM2AgACQCADQX9qIgFBAksNAAJAIAFBAWsOAgEAAgtBbA8LIAAhAwsgAwsMACAAIAEgAkEAEC4LiAQCA38CfiADEBYhBCAAQQBBKBAQIQAgBCACSwRAIAQPCyABRQRAQX8PCwJAAkAgA0EBRg0AIAEoAAAiBkGo6r5pRg0AQXYhAyAGQXBxQdDUtMIBRw0BQQghAyACQQhJDQEgAEEAQSgQECEAIAEoAAQhASAAQQE2AhQgACABrTcDAEEADwsgASACIAMQLyIDIAJLDQAgACADNgIYQXIhAyABIARqIgVBf2otAAAiAkEIcQ0AIAJBIHEiBkUEQEFwIQMgBS0AACIFQacBSw0BIAVBB3GtQgEgBUEDdkEKaq2GIgdCA4h+IAd8IQggBEEBaiEECyACQQZ2IQMgAkECdiEFAkAgAkEDcUF/aiICQQJLBEBBACECDAELAkACQAJAIAJBAWsOAgECAAsgASAEai0AACECIARBAWohBAwCCyABIARqLwAAIQIgBEECaiEEDAELIAEgBGooAAAhAiAEQQRqIQQLIAVBAXEhBQJ+AkACQAJAIANBf2oiA0ECTQRAIANBAWsOAgIDAQtCfyAGRQ0DGiABIARqMQAADAMLIAEgBGovAACtQoACfAwCCyABIARqKAAArQwBCyABIARqKQAACyEHIAAgBTYCICAAIAI2AhwgACAHNwMAQQAhAyAAQQA2AhQgACAHIAggBhsiBzcDCCAAIAdCgIAIIAdCgIAIVBs+AhALIAMLWwEBf0G4fyEDIAIQFiICIAFNBH8gACACakF/ai0AACIAQQNxQQJ0QaAeaigC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C0Egak8NAQsgByAHKQNoNwMQIAcgBykDYDcDCCAEIA0gB0EIaiAHQdwAaiAPIA4gESAQEB4hCwwBCyACIARqIQggBCAKEAcgAkERTwRAIARBEGohAgNAIAIgCkEQaiIKEAcgAkEQaiICIAhJDQALCyAIIAlrIQIgByATNgJcIAkgCCAOa0sEQCAJIAggEWtLBEBBbCELDAILIBAgAiAOayICaiIKIANqIBBNBEAgCCAKIAMQDxoMAgsgCCAKQQAgAmsQDyEIIAcgAiADaiIDNgJkIAggAmshCCAOIQILIAlBEE8EQCADIAhqIQMDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALDAELAkAgCUEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgCUECdCIDQcAeaigCAGoiAhAXIAIgA0HgHmooAgBrIQIgBygCZCEDDAELIAggAhAMCyADQQlJDQAgAyAIaiEDIAhBCGoiCCACQQhqIgJrQQ9MBEADQCAIIAIQDCACQQhqIQIgCEEIaiIIIANJDQAMAgALAAsDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALCyAHQRhqEAQaIAsgDCALEAMiAhshDCAEIAQgC2ogAhshBCAFQX9qIgUNAAsgDBADDQFBbCEMIAdBGGoQBEECSQ0BQQAhCANAIAhBA0cEQCAAIAhBAnQiAmpBrNABaiACIAdqKAJENgIAIAhBAWohCAwBCwsgBygCXCEIC0G6fyEMIA8gCGsiACANIARrSw0AIAQEfyAEIAggABALIABqBUEACyABayEMCyAHQfAAaiQAIAwLkRcCFn8FfiMAQdABayIHJAAgByAAKALw4QEiCDYCvAEgASACaiESIAggACgCgOIBaiETAkACQCAFRQRAIAEhAwwBCyAAKALE4AEhESAAKALA4AEhFSAAKAK84AEhDyAAQQE2AozhAUEAIQgDQCAIQQNHBEAgByAIQQJ0IgJqIAAgAmpBrNABaigCADYCVCAIQQFqIQgMAQsLIAcgETYCZCAHIA82AmAgByABIA9rNgJoQWwhECAHQShqIAMgBBAGEAMNASAFQQQgBUEESBshFyAHQTxqIAdBKGogACgCABATIAdBxABqIAdBKGogACgCCBATIAdBzABqIAdB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IAdB0AFqJAAgEAslACAAQgA3AgAgAEEAOwEIIABBADoACyAAIAE2AgwgACACOgAKC7QFAQN/IwBBMGsiBCQAIABB/wFqIgVBfWohBgJAIAMvAQIEQCAEQRhqIAEgAhAGIgIQAw0BIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahASOgAAIAMgBEEIaiAEQRhqEBI6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0FIAEgBEEQaiAEQRhqEBI6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBSABIARBCGogBEEYahASOgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEjoAACABIAJqIABrIQIMAwsgAyAEQRBqIARBGGoQEjoAAiADIARBCGogBEEYahASOgADIANBBGohAwwAAAsACyAEQRhqIAEgAhAGIgIQAw0AIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahAROgAAIAMgBEEIaiAEQRhqEBE6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0EIAEgBEEQaiAEQRhqEBE6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBCABIARBCGogBEEYahAROgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEToAACABIAJqIABrIQIMAgsgAyAEQRBqIARBGGoQEToAAiADIARBCGogBEEYahAROgADIANBBGohAwwAAAsACyAEQTBqJAAgAgtpAQF/An8CQAJAIAJBB00NACABKAAAQbfIwuF+Rw0AIAAgASgABDYCmOIBQWIgAEEQaiABIAIQPiIDEAMNAhogAEKBgICAEDcDiOEBIAAgASADaiACIANrECoMAQsgACABIAIQKgtBAAsLrQMBBn8jAEGAAWsiAyQAQWIhCAJAIAJBCUkNACAAQZjQAGogAUEIaiIEIAJBeGogAEGY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wOABCwutAgIEfwF+IwBBQGoiBCQAAkACQCACQQhJDQAgASgAAEFwcUHQ1LTCAUcNACABIAIQIiEBIABCADcDCCAAQQA2AgQgACABNgIADAELIARBGGogASACEC0iAxADBEAgACADEBoMAQsgAwRAIABBuH8QGgwBCyACIAQoAjAiA2shAiABIANqIQMDQAJAIAAgAyACIARBCGoQLCIFEAMEfyAFBSACIAVBA2oiBU8NAUG4fwsQGgwCCyAGQQFqIQYgAiAFayECIAMgBWohAyAEKAIMRQ0ACyAEKAI4BEAgAkEDTQRAIABBuH8QGgwCCyADQQRqIQMLIAQoAighAiAEKQMYIQcgAEEANgIEIAAgAyABazYCACAAIAIgBmytIAcgB0J/URs3AwgLIARBQGskAAslAQF/IwBBEGsiAiQAIAIgACABEFEgAigCACEAIAJBEGokACAAC30BBH8jAEGQBGsiBCQAIARB/wE2AggCQCAEQRBqIARBCGogBEEMaiABIAIQFSIGEAMEQCAGIQUMAQtBVCEFIAQoAgwiB0EGSw0AIAMgBEEQaiAEKAIIIAcQQSIFEAMNACAAIAEgBmogAiAGayADEDwhBQsgBEGQBGokACAFC4cBAgJ/An5BABAWIQMCQANAIAEgA08EQAJAIAAoAABBcHFB0NS0wgFGBEAgACABECIiAhADRQ0BQn4PCyAAIAEQVSIEQn1WDQMgBCAFfCIFIARUIQJCfiEEIAINAyAAIAEQUiICEAMNAwsgASACayEBIAAgAmohAAwBCwtCfiAFIAEbIQQLIAQLPwIBfwF+IwBBMGsiAiQAAn5CfiACQQhqIAAgARAtDQAaQgAgAigCHEEBRg0AGiACKQMICyEDIAJBMGokACADC40BAQJ/IwBBMGsiASQAAkAgAEUNACAAKAKI4gENACABIABB/OEBaigCADYCKCABIAApAvThATcDICAAEDAgACgCqOIBIQIgASABKAIoNgIYIAEgASkDIDcDECACIAFBEGoQGyAAQQA2AqjiASABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALKgECfyMAQRBrIgAkACAAQQA2AgggAEIANwMAIAAQWCEBIABBEGokACABC4cBAQN/IwBBEGsiAiQAAkAgACgCAEUgACgCBEVzDQAgAiAAKAIINgIIIAIgACkCADcDAAJ/IAIoAgAiAQRAIAIoAghBqOMJIAERBQAMAQtBqOMJECgLIgFFDQAgASAAKQIANwL04QEgAUH84QFqIAAoAgg2AgAgARBZIAEhAwsgAkEQaiQAIAMLywEBAn8jAEEgayIBJAAgAEGBgIDAADYCtOIBIABBADYCiOIBIABBADYC7OEBIABCADcDkOIBIABBADYCpOMJIABBADYC3OIBIABCADcCzOIBIABBADYCvOIBIABBADYCxOABIABCADcCnOIBIABBpOIBakIANwIAIABBrOIBakEANgIAIAFCADcCECABQgA3AhggASABKQMYNwMIIAEgASkDEDcDACABKAIIQQh2QQFxIQIgAEEANgLg4gEgACACNgKM4gEgAUEgaiQAC3YBA38jAEEwayIBJAAgAARAIAEgAEHE0AFqIgIoAgA2AiggASAAKQK80AE3AyAgACgCACEDIAEgAigCADYCGCABIAApArzQATcDECADIAFBEGoQGyABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALzAEBAX8gACABKAK00AE2ApjiASAAIAEoAgQiAjYCwOABIAAgAjYCvOABIAAgAiABKAIIaiICNgK44AEgACACNgLE4AEgASgCuNABBEAgAEKBgICAEDcDiOEBIAAgAUGk0ABqNgIMIAAgAUGUIGo2AgggACABQZwwajYCBCAAIAFBDGo2AgAgAEGs0AFqIAFBqNABaigCADYCACAAQbDQAWogAUGs0AFqKAIANgIAIABBtNABaiABQbDQAWooAgA2AgAPCyAAQgA3A4jhAQs7ACACRQRAQbp/DwsgBEUEQEFsDwsgAiAEEGAEQCAAIAEgAiADIAQgBRBhDwsgACABIAIgAyAEIAUQZQtGAQF/IwBBEGsiBSQAIAVBCGogBBAOAn8gBS0ACQRAIAAgASACIAMgBBAyDAELIAAgASACIAMgBBA0CyEAIAVBEGokACAACzQAIAAgAyAEIAUQNiIFEAMEQCAFDwsgBSAESQR/IAEgAiADIAVqIAQgBWsgABA1BUG4fwsLRgEBfyMAQRBrIgUkACAFQQhqIAQQDgJ/IAUtAAkEQCAAIAEgAiADIAQQYgwBCyAAIAEgAiADIAQQNQshACAFQRBqJAAgAAtZAQF/QQ8hAiABIABJBEAgAUEEdCAAbiECCyAAQQh2IgEgAkEYbCIAQYwIaigCAGwgAEGICGooAgBqIgJBA3YgAmogAEGACGooAgAgAEGECGooAgAgAWxqSQs3ACAAIAMgBCAFQYAQEDMiBRADBEAgBQ8LIAUgBEkEfyABIAIgAyAFaiAEIAVrIAAQMgVBuH8LC78DAQN/IwBBIGsiBSQAIAVBCGogAiADEAYiAhADRQRAIAAgAWoiB0F9aiEGIAUgBBAOIARBBGohAiAFLQACIQMDQEEAIAAgBkkgBUEIahAEGwRAIAAgAiAFQQhqIAMQAkECdGoiBC8BADsAACAFQQhqIAQtAAIQASAAIAQtAANqIgQgAiAFQQhqIAMQAkECdGoiAC8BADsAACAFQQhqIAAtAAIQASAEIAAtAANqIQAMAQUgB0F+aiEEA0AgBUEIahAEIAAgBEtyRQRAIAAgAiAFQQhqIAMQAkECdGoiBi8BADsAACAFQQhqIAYtAAIQASAAIAYtAANqIQAMAQsLA0AgACAES0UEQCAAIAIgBUEIaiADEAJBAnRqIgYvAQA7AAAgBUEIaiAGLQACEAEgACAGLQADaiEADAELCwJAIAAgB08NACAAIAIgBUEIaiADEAIiA0ECdGoiAC0AADoAACAALQADQQFGBEAgBUEIaiAALQACEAEMAQsgBSgCDEEfSw0AIAVBCGogAiADQQJ0ai0AAhABIAUoAgxBIUkNACAFQSA2AgwLIAFBbCAFQQhqEAobIQILCwsgBUEgaiQAIAILkgIBBH8jAEFAaiIJJAAgCSADQTQQCyEDAkAgBEECSA0AIAMgBEECdGooAgAhCSADQTxqIAgQIyADQQE6AD8gAyACOgA+QQAhBCADKAI8IQoDQCAEIAlGDQEgACAEQQJ0aiAKNgEAIARBAWohBAwAAAsAC0EAIQkDQCAGIAlGRQRAIAMgBSAJQQF0aiIKLQABIgtBAnRqIgwoAgAhBCADQTxqIAotAABBCHQgCGpB//8DcRAjIANBAjoAPyADIAcgC2siCiACajoAPiAEQQEgASAKa3RqIQogAygCPCELA0AgACAEQQJ0aiALNgEAIARBAWoiBCAKSQ0ACyAMIAo2AgAgCUEBaiEJDAELCyADQUBrJAALowIBCX8jAEHQAGsiCSQAIAlBEGogBUE0EAsaIAcgBmshDyAHIAFrIRADQAJAIAMgCkcEQEEBIAEgByACIApBAXRqIgYtAAEiDGsiCGsiC3QhDSAGLQAAIQ4gCUEQaiAMQQJ0aiIMKAIAIQYgCyAPTwRAIAAgBkECdGogCyAIIAUgCEE0bGogCCAQaiIIQQEgCEEBShsiCCACIAQgCEECdGooAgAiCEEBdGogAyAIayAHIA4QYyAGIA1qIQgMAgsgCUEMaiAOECMgCUEBOgAPIAkgCDoADiAGIA1qIQggCSgCDCELA0AgBiAITw0CIAAgBkECdGogCzYBACAGQQFqIQYMAAALAAsgCUHQAGokAA8LIAwgCDYCACAKQQFqIQoMAAALAAs0ACAAIAMgBCAFEDYiBRADBEAgBQ8LIAUgBEkEfyABIAIgAyAFaiAEIAVrIAAQNAVBuH8LCyMAIAA/AEEQdGtB//8DakEQdkAAQX9GBEBBAA8LQQAQAEEBCzsBAX8gAgRAA0AgACABIAJBgCAgAkGAIEkbIgMQCyEAIAFBgCBqIQEgAEGAIGohACACIANrIgINAAsLCwYAIAAQAwsLqBUJAEGICAsNAQAAAAEAAAACAAAAAgBBoAgLswYBAAAAAQAAAAIAAAACAAAAJgAAAIIAAAAhBQAASgAAAGcIAAAmAAAAwAEAAIAAAABJBQAASgAAAL4IAAApAAAALAIAAIAAAABJBQAASgAAAL4IAAAvAAAAygIAAIAAAACKBQAASgAAAIQJAAA1AAAAcwMAAIAAAACdBQAASgAAAKAJAAA9AAAAgQMAAIAAAADrBQAASwAAAD4KAABEAAAAngMAAIAAAABNBgAASwAAAKoKAABLAAAAswMAAIAAAADBBgAATQAAAB8NAABNAAAAUwQAAIAAAAAjCAAAUQAAAKYPAABUAAAAmQQAAIAAAABLCQAAVwAAALESAABYAAAA2gQAAIAAAABvCQAAXQAAACMUAABUAAAARQUAAIAAAABUCgAAagAAAIwUAABqAAAArwUAAIAAAAB2CQAAfAAAAE4QAAB8AAAA0gIAAIAAAABjBwAAkQAAAJAHAACSAAAAAAAAAAEAAAABAAAABQAAAA0AAAAdAAAAPQAAAH0AAAD9AAAA/QEAAP0DAAD9BwAA/Q8AAP0fAAD9PwAA/X8AAP3/AAD9/wEA/f8DAP3/BwD9/w8A/f8fAP3/PwD9/38A/f//AP3//wH9//8D/f//B/3//w/9//8f/f//P/3//38AAAAAAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAHwAAAAMAAAAEAAAABQAAAAYAAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAAQAAAAEQAAABIAAAATAAAAFAAAABUAAAAWAAAAFwAAABgAAAAZAAAAGgAAABsAAAAcAAAAHQAAAB4AAAAfAAAAIAAAACEAAAAiAAAAIwAAACUAAAAnAAAAKQAAACsAAAAvAAAAMwAAADsAAABDAAAAUwAAAGMAAACDAAAAAwEAAAMCAAADBAAAAwgAAAMQAAADIAAAA0AAAAOAAAADAAEAQeAPC1EBAAAAAQAAAAEAAAABAAAAAgAAAAIAAAADAAAAAwAAAAQAAAAEAAAABQAAAAcAAAAIAAAACQAAAAoAAAALAAAADAAAAA0AAAAOAAAADwAAABAAQcQQC4sBAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABIAAAAUAAAAFgAAABgAAAAcAAAAIAAAACgAAAAwAAAAQAAAAIAAAAAAAQAAAAIAAAAEAAAACAAAABAAAAAgAAAAQAAAAIAAAAAAAQBBkBIL5gQBAAAAAQAAAAEAAAABAAAAAgAAAAIAAAADAAAAAwAAAAQAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAAAEAAAAEAAAACAAAAAAAAAABAAEBBgAAAAAAAAQAAAAAEAAABAAAAAAgAAAFAQAAAAAAAAUDAAAAAAAABQQAAAAAAAAFBgAAAAAAAAUHAAAAAAAABQkAAAAAAAAFCgAAAAAAAAUMAAAAAAAABg4AAAAAAAEFEAAAAAAAAQUUAAAAAAABBRYAAAAAAAIFHAAAAAAAAwUgAAAAAAAEBTAAAAAgAAYFQAAAAAAABwWAAAAAAAAIBgABAAAAAAoGAAQAAAAADAYAEAAAIAAABAAAAAAAAAAEAQAAAAAAAAUCAAAAIAAABQQAAAAAAAAFBQAAACAAAAUHAAAAAAAABQgAAAAgAAAFCgAAAAAAAAULAAAAAAAABg0AAAAgAAEFEAAAAAAAAQUSAAAAIAABBRYAAAAAAAIFGAAAACAAAwUgAAAAAAADBSgAAAAAAAYEQAAAABAABgRAAAAAIAAHBYAAAAAAAAkGAAIAAAAACwYACAAAMAAABAAAAAAQAAAEAQAAACAAAAUCAAAAIAAABQMAAAAgAAAFBQAAACAAAAUGAAAAIAAABQgAAAAgAAAFCQAAACAAAAULAAAAIAAABQwAAAAAAAAGDwAAACAAAQUSAAAAIAABBRQAAAAgAAIFGAAAACAAAgUcAAAAIAADBSgAAAAgAAQFMAAAAAAAEAYAAAEAAAAPBgCAAAAAAA4GAEAAAAAADQYAIABBgBcLhwIBAAEBBQAAAAAAAAUAAAAAAAAGBD0AAAAAAAkF/QEAAAAADwX9fwAAAAAVBf3/HwAAAAMFBQAAAAAABwR9AAAAAAAMBf0PAAAAABIF/f8DAAAAFwX9/38AAAAFBR0AAAAAAAgE/QAAAAAADgX9PwAAAAAUBf3/DwAAAAIFAQAAABAABwR9AAAAAAALBf0HAAAAABEF/f8BAAAAFgX9/z8AAAAEBQ0AAAAQAAgE/QAAAAAADQX9HwAAAAATBf3/BwAAAAEFAQAAABAABgQ9AAAAAAAKBf0DAAAAABAF/f8AAAAAHAX9//8PAAAbBf3//wcAABoF/f//AwAAGQX9//8BAAAYBf3//wBBkBkLhgQBAAEBBgAAAAAAAAYDAAAAAAAABAQAAAAgAAAFBQAAAAAAAAUGAAAAAAAABQgAAAAAAAAFCQAAAAAAAAULAAAAAAAABg0AAAAAAAAGEAAAAAAAAAYTAAAAAAAABhYAAAAAAAAGGQAAAAAAAAYcAAAAAAAABh8AAAAAAAAGIgAAAAAAAQYlAAAAAAABBikAAAAAAAIGLwAAAAAAAwY7AAAAAAAEBlMAAAAAAAcGgwAAAAAACQYDAgAAEAAABAQAAAAAAAAEBQAAACAAAAUGAAAAAAAABQcAAAAgAAAFCQAAAAAAAAUKAAAAAAAABgwAAAAAAAAGDwAAAAAAAAYSAAAAAAAABhUAAAAAAAAGGAAAAAAAAAYbAAAAAAAABh4AAAAAAAAGIQAAAAAAAQYjAAAAAAABBicAAAAAAAIGKwAAAAAAAwYzAAAAAAAEBkMAAAAAAAUGYwAAAAAACAYDAQAAIAAABAQAAAAwAAAEBAAAABAAAAQFAAAAIAAABQcAAAAgAAAFCAAAACAAAAUKAAAAIAAABQsAAAAAAAAGDgAAAAAAAAYRAAAAAAAABhQAAAAAAAAGFwAAAAAAAAYaAAAAAAAABh0AAAAAAAAGIAAAAAAAEAYDAAEAAAAPBgOAAAAAAA4GA0AAAAAADQYDIAAAAAAMBgMQAAAAAAsGAwgAAAAACgYDBABBpB0L2QEBAAAAAwAAAAcAAAAPAAAAHwAAAD8AAAB/AAAA/wAAAP8BAAD/AwAA/wcAAP8PAAD/HwAA/z8AAP9/AAD//wAA//8BAP//AwD//wcA//8PAP//HwD//z8A//9/AP///wD///8B////A////wf///8P////H////z////9/AAAAAAEAAAACAAAABAAAAAAAAAACAAAABAAAAAgAAAAAAAAAAQAAAAIAAAABAAAABAAAAAQAAAAEAAAABAAAAAgAAAAIAAAACAAAAAcAAAAIAAAACQAAAAoAAAALAEGgIAsDwBBQ";var Ud="display-p3",Nd="display-p3-linear";var yv={...We.spaces[nt],outputColorSpaceConfig:{drawingBufferColorSpace:nt,toneMappingMode:"extended"}};var Zl=new WeakMap,jl=0,$l,xi=class s extends vn{constructor(e){super(e),this.transcoderPath="",this.transcoderBinary=null,this.transcoderPending=null,this.workerPool=new Na,this.workerSourceURL="",this.workerConfig=null,typeof MSC_TRANSCODER<"u"&&console.warn('THREE.KTX2Loader: Please update to latest "basis_transcoder". "msc_basis_transcoder" is no longer supported in three.js r125+.')}setTranscoderPath(e){return this.transcoderPath=e,this}setWorkerLimit(e){return this.workerPool.setWorkerLimit(e),this}async detectSupportAsync(e){return this.workerConfig={astcSupported:await e.hasFeatureAsync("texture-compression-astc"),astcHDRSupported:!1,etc1Supported:await e.hasFeatureAsync("texture-compression-etc2"),etc2Supported:await e.hasFeatureAsync("texture-compression-etc2"),dxtSupported:await e.hasFeatureAsync("texture-compression-bc"),bptcSupported:await e.hasFeatureAsync("texture-compression-bc"),pvrtcSupported:await e.hasFeatureAsync("texture-compression-pvrtc")},this}detectSupport(e){return e.isWebGPURenderer===!0?this.workerConfig={astcSupported:e.hasFeature("texture-compression-astc"),astcHDRSupported:!1,etc1Supported:e.hasFeature("texture-compression-etc2"),etc2Supported:e.hasFeature("texture-compression-etc2"),dxtSupported:e.hasFeature("texture-compression-bc"),bptcSupported:e.hasFeature("texture-compression-bc"),pvrtcSupported:e.hasFeature("texture-compression-pvrtc")}:this.workerConfig={astcSupported:e.extensions.has("WEBGL_compressed_texture_astc"),astcHDRSupported:e.extensions.has("WEBGL_compressed_texture_astc")&&e.extensions.get("WEBGL_compressed_texture_astc").getSupportedProfiles().includes("hdr"),etc1Supported:e.extensions.has("WEBGL_compressed_texture_etc1"),etc2Supported:e.extensions.has("WEBGL_compressed_texture_etc"),dxtSupported:e.extensions.has("WEBGL_compressed_texture_s3tc"),bptcSupported:e.extensions.has("EXT_texture_compression_bptc"),pvrtcSupported:e.extensions.has("WEBGL_compressed_texture_pvrtc")||e.extensions.has("WEBKIT_WEBGL_compressed_texture_pvrtc")},this}init(){if(!this.transcoderPending){let e=new zn(this.manager);e.setPath(this.transcoderPath),e.setWithCredentials(this.withCredentials);let t=e.loadAsync("basis_transcoder.js"),n=new zn(this.manager);n.setPath(this.transcoderPath),n.setResponseType("arraybuffer"),n.setWithCredentials(this.withCredentials);let i=n.loadAsync("basis_transcoder.wasm");this.transcoderPending=Promise.all([t,i]).then(([r,o])=>{let a=s.BasisWorker.toString(),l=["/* constants */","let _EngineFormat = "+JSON.stringify(s.EngineFormat),"let _EngineType = "+JSON.stringify(s.EngineType),"let _TranscoderFormat = "+JSON.stringify(s.TranscoderFormat),"let _BasisFormat = "+JSON.stringify(s.BasisFormat),"/* basis_transcoder.js */",r,"/* worker */",a.substring(a.indexOf("{")+1,a.lastIndexOf("}"))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([l])),this.transcoderBinary=o,this.workerPool.setWorkerCreator(()=>{let c=new Worker(this.workerSourceURL),h=this.transcoderBinary.slice(0);return c.postMessage({type:"init",config:this.workerConfig,transcoderBinary:h},[h]),c})}),jl>0&&console.warn("THREE.KTX2Loader: Multiple active KTX2 loaders may cause performance issues. Use a single KTX2Loader instance, or call .dispose() on old instances."),jl++}return this.transcoderPending}load(e,t,n,i){if(this.workerConfig===null)throw new Error("THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.");let r=new zn(this.manager);r.setPath(this.path),r.setCrossOrigin(this.crossOrigin),r.setWithCredentials(this.withCredentials),r.setResponseType("arraybuffer"),r.load(e,o=>{this.parse(o,t,i)},n,i)}parse(e,t,n){if(this.workerConfig===null)throw new Error("THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.");if(Zl.has(e))return Zl.get(e).promise.then(t).catch(n);this._createTexture(e).then(i=>t?t(i):null).catch(n)}_createTextureFrom(e,t){let{type:n,error:i,data:{faces:r,width:o,height:a,format:l,type:c,dfdFlags:h}}=e;if(n==="error")return Promise.reject(i);let d;if(t.faceCount===6)d=new Kr(r,l,c);else{let f=r[0].mipmaps;d=t.layerCount>1?new Wr(f,o,a,t.layerCount,l,c):new Pi(f,o,a,l,c)}return d.minFilter=r[0].mipmaps.length===1?Et:Kt,d.magFilter=Et,d.generateMipmaps=!1,d.needsUpdate=!0,d.colorSpace=Cf(t),d.premultiplyAlpha=!!(h&1),d}async _createTexture(e,t={}){let n=Ld(new Uint8Array(e)),i=n.vkFormat===1000066e3&&n.dataFormatDescriptor[0].colorModel===167;if(!(n.vkFormat===0||i&&!this.workerConfig.astcHDRSupported))return ty(n);let o=t,a=this.init().then(()=>this.workerPool.postMessage({type:"transcode",buffer:e,taskConfig:o},[e])).then(l=>this._createTextureFrom(l.data,n));return Zl.set(e,{promise:a}),a}dispose(){this.workerPool.dispose(),this.workerSourceURL&&URL.revokeObjectURL(this.workerSourceURL),jl--}};xi.BasisFormat={ETC1S:0,UASTC:1,UASTC_HDR:2};xi.TranscoderFormat={ETC1:0,ETC2:1,BC1:2,BC3:3,BC4:4,BC5:5,BC7_M6_OPAQUE_ONLY:6,BC7_M5:7,PVRTC1_4_RGB:8,PVRTC1_4_RGBA:9,ASTC_4x4:10,ATC_RGB:11,ATC_RGBA_INTERPOLATED_ALPHA:12,RGBA32:13,RGB565:14,BGR565:15,RGBA4444:16,BC6H:22,RGB_HALF:24,RGBA_HALF:25};xi.EngineFormat={RGBAFormat:Tt,RGBA_ASTC_4x4_Format:yi,RGB_BPTC_UNSIGNED_Format:lr,RGBA_BPTC_Format:Wi,RGBA_ETC2_EAC_Format:fs,RGBA_PVRTC_4BPPV1_Format:Vi,RGBA_S3TC_DXT5_Format:hs,RGB_ETC1_Format:cr,RGB_ETC2_Format:ds,RGB_PVRTC_4BPPV1_Format:ar,RGBA_S3TC_DXT1_Format:_i};xi.EngineType={UnsignedByteType:Ue,HalfFloatType:Xt,FloatType:Ut};xi.BasisWorker=function(){let s,e,t,n=_EngineFormat,i=_EngineType,r=_TranscoderFormat,o=_BasisFormat;self.addEventListener("message",function(p){let g=p.data;switch(g.type){case"init":s=g.config,a(g.transcoderBinary);break;case"transcode":e.then(()=>{try{let{faces:m,buffers:A,width:x,height:v,hasAlpha:y,format:I,type:T,dfdFlags:R}=l(g.buffer);self.postMessage({type:"transcode",id:g.id,data:{faces:m,width:x,height:v,hasAlpha:y,format:I,type:T,dfdFlags:R}},A)}catch(m){console.error(m),self.postMessage({type:"error",id:g.id,error:m.message})}});break}});function a(p){e=new Promise(g=>{t={wasmBinary:p,onRuntimeInitialized:g},BASIS(t)}).then(()=>{t.initializeBasis(),t.KTX2File===void 0&&console.warn("THREE.KTX2Loader: Please update Basis Universal transcoder.")})}function l(p){let g=new t.KTX2File(new Uint8Array(p));function m(){g.close(),g.delete()}if(!g.isValid())throw m(),new Error("THREE.KTX2Loader:	Invalid or unsupported .ktx2 file");let A;if(g.isUASTC())A=o.UASTC;else if(g.isETC1S())A=o.ETC1S;else if(g.isHDR())A=o.UASTC_HDR;else throw new Error("THREE.KTX2Loader: Unknown Basis encoding");let x=g.getWidth(),v=g.getHeight(),y=g.getLayers()||1,I=g.getLevels(),T=g.getFaces(),R=g.getHasAlpha(),F=g.getDFDFlags(),{transcoderFormat:C,engineFormat:M,engineType:B}=d(A,x,v,R);if(!x||!v||!I)throw m(),new Error("THREE.KTX2Loader:	Invalid texture");if(!g.startTranscoding())throw m(),new Error("THREE.KTX2Loader: .startTranscoding failed");let U=[],k=[];for(let H=0;H<T;H++){let K=[];for(let V=0;V<I;V++){let $=[],G,ie;for(let re=0;re<y;re++){let ye=g.getImageLevelInfo(V,re,H);H===0&&V===0&&re===0&&(ye.origWidth%4!==0||ye.origHeight%4!==0)&&console.warn("THREE.KTX2Loader: ETC1S and UASTC textures should use multiple-of-four dimensions."),I>1?(G=ye.origWidth,ie=ye.origHeight):(G=ye.width,ie=ye.height);let ze=new Uint8Array(g.getImageTranscodedSizeInBytes(V,re,0,C)),st=g.transcodeImage(ze,V,re,H,C,0,-1,-1);if(B===i.HalfFloatType&&(ze=new Uint16Array(ze.buffer,ze.byteOffset,ze.byteLength/Uint16Array.BYTES_PER_ELEMENT)),!st)throw m(),new Error("THREE.KTX2Loader: .transcodeImage failed.");$.push(ze)}let le=u($);K.push({data:le,width:G,height:ie}),k.push(le.buffer)}U.push({mipmaps:K,width:x,height:v,format:M,type:B})}return m(),{faces:U,buffers:k,width:x,height:v,hasAlpha:R,dfdFlags:F,format:M,type:B}}let c=[{if:"astcSupported",basisFormat:[o.UASTC],transcoderFormat:[r.ASTC_4x4,r.ASTC_4x4],engineFormat:[n.RGBA_ASTC_4x4_Format,n.RGBA_ASTC_4x4_Format],engineType:[i.UnsignedByteType],priorityETC1S:1/0,priorityUASTC:1,needsPowerOfTwo:!1},{if:"bptcSupported",basisFormat:[o.ETC1S,o.UASTC],transcoderFormat:[r.BC7_M5,r.BC7_M5],engineFormat:[n.RGBA_BPTC_Format,n.RGBA_BPTC_Format],engineType:[i.UnsignedByteType],priorityETC1S:3,priorityUASTC:2,needsPowerOfTwo:!1},{if:"dxtSupported",basisFormat:[o.ETC1S,o.UASTC],transcoderFormat:[r.BC1,r.BC3],engineFormat:[n.RGBA_S3TC_DXT1_Format,n.RGBA_S3TC_DXT5_Format],engineType:[i.UnsignedByteType],priorityETC1S:4,priorityUASTC:5,needsPowerOfTwo:!1},{if:"etc2Supported",basisFormat:[o.ETC1S,o.UASTC],transcoderFormat:[r.ETC1,r.ETC2],engineFormat:[n.RGB_ETC2_Format,n.RGBA_ETC2_EAC_Format],engineType:[i.UnsignedByteType],priorityETC1S:1,priorityUASTC:3,needsPowerOfTwo:!1},{if:"etc1Supported",basisFormat:[o.ETC1S,o.UASTC],transcoderFormat:[r.ETC1],engineFormat:[n.RGB_ETC1_Format],engineType:[i.UnsignedByteType],priorityETC1S:2,priorityUASTC:4,needsPowerOfTwo:!1},{if:"pvrtcSupported",basisFormat:[o.ETC1S,o.UASTC],transcoderFormat:[r.PVRTC1_4_RGB,r.PVRTC1_4_RGBA],engineFormat:[n.RGB_PVRTC_4BPPV1_Format,n.RGBA_PVRTC_4BPPV1_Format],engineType:[i.UnsignedByteType],priorityETC1S:5,priorityUASTC:6,needsPowerOfTwo:!0},{if:"bptcSupported",basisFormat:[o.UASTC_HDR],transcoderFormat:[r.BC6H],engineFormat:[n.RGB_BPTC_UNSIGNED_Format],engineType:[i.HalfFloatType],priorityHDR:1,needsPowerOfTwo:!1},{basisFormat:[o.ETC1S,o.UASTC],transcoderFormat:[r.RGBA32,r.RGBA32],engineFormat:[n.RGBAFormat,n.RGBAFormat],engineType:[i.UnsignedByteType,i.UnsignedByteType],priorityETC1S:100,priorityUASTC:100,needsPowerOfTwo:!1},{basisFormat:[o.UASTC_HDR],transcoderFormat:[r.RGBA_HALF],engineFormat:[n.RGBAFormat],engineType:[i.HalfFloatType],priorityHDR:100,needsPowerOfTwo:!1}],h={[o.ETC1S]:c.filter(p=>p.basisFormat.includes(o.ETC1S)).sort((p,g)=>p.priorityUASTC-g.priorityUASTC),[o.UASTC]:c.filter(p=>p.basisFormat.includes(o.UASTC)).sort((p,g)=>p.priorityUASTC-g.priorityUASTC),[o.UASTC_HDR]:c.filter(p=>p.basisFormat.includes(o.UASTC_HDR)).sort((p,g)=>p.priorityHDR-g.priorityHDR)};function d(p,g,m,A){let x=h[p];for(let v=0;v<x.length;v++){let y=x[v];if(y.if&&!s[y.if]||!y.basisFormat.includes(p)||A&&y.transcoderFormat.length<2||y.needsPowerOfTwo&&!(f(g)&&f(m)))continue;let I=y.transcoderFormat[A?1:0],T=y.engineFormat[A?1:0],R=y.engineType[0];return{transcoderFormat:I,engineFormat:T,engineType:R}}throw new Error("THREE.KTX2Loader: Failed to identify transcoding target.")}function f(p){return p<=2?!0:(p&p-1)===0&&p!==0}function u(p){if(p.length===1)return p[0];let g=0;for(let x=0;x<p.length;x++){let v=p[x];g+=v.byteLength}let m=new Uint8Array(g),A=0;for(let x=0;x<p.length;x++){let v=p[x];m.set(v,A),A+=v.byteLength}return m}};var ey=new Set([Tt,ls,gi,Xn]),eh={109:Tt,103:gi,100:Xn,97:Tt,83:gi,76:Xn,43:Tt,37:Tt,22:gi,16:gi,15:Xn,9:Xn,123:ls,122:ls,152:fs,148:ds,1000066e3:yi,158:yi,157:yi,1000066004:zi,166:zi,165:zi,134:_i,133:_i,132:Gi,131:Gi,138:Hi,137:Hi,140:ur,139:hr,142:fr,141:dr,146:Wi,145:Wi,1000054005:Vi,1000054001:Vi,1000054004:us,1000054e3:us},Mr={109:Ut,103:Ut,100:Ut,97:Xt,83:Xt,76:Xt,43:Ue,37:Ue,22:Ue,16:Ue,15:Ue,9:Ue,123:sr,122:rr,152:Ue,148:Ue,1000066e3:Xt,158:Ue,157:Ue,1000066004:Xt,166:Ue,165:Ue,134:Ue,133:Ue,132:Ue,131:Ue,138:Ue,137:Ue,140:Ue,139:Ue,142:Ue,141:Ue,146:Ue,145:Ue,1000054005:Ue,1000054001:Ue,1000054004:Ue,1000054e3:Ue};async function ty(s){let{vkFormat:e}=s;if(eh[e]===void 0)throw new Error("THREE.KTX2Loader: Unsupported vkFormat: "+e);Mr[e]===void 0&&console.warn('THREE.KTX2Loader: Missing ".type" for vkFormat: '+e);let t;s.supercompressionScheme===2&&($l||($l=new Promise(async o=>{let a=new Oa;await a.init(),o(a)})),t=await $l);let n=[];for(let o=0;o<s.levels.length;o++){let a=Math.max(1,s.pixelWidth>>o),l=Math.max(1,s.pixelHeight>>o),c=s.pixelDepth?Math.max(1,s.pixelDepth>>o):0,h=s.levels[o],d;if(s.supercompressionScheme===0)d=h.levelData;else if(s.supercompressionScheme===2)d=t.decode(h.levelData,h.uncompressedByteLength);else throw new Error("THREE.KTX2Loader: Unsupported supercompressionScheme.");let f;Mr[e]===Ut?f=new Float32Array(d.buffer,d.byteOffset,d.byteLength/Float32Array.BYTES_PER_ELEMENT):Mr[e]===Xt?f=new Uint16Array(d.buffer,d.byteOffset,d.byteLength/Uint16Array.BYTES_PER_ELEMENT):Mr[e]===sr||Mr[e]===rr?f=new Uint32Array(d.buffer,d.byteOffset,d.byteLength/Uint32Array.BYTES_PER_ELEMENT):f=d,n.push({data:f,width:a,height:l,depth:c})}let i=s.levelCount===0||n.length>1,r;if(ey.has(eh[e]))r=s.pixelDepth===0?new ai(n[0].data,s.pixelWidth,s.pixelHeight):new Vs(n[0].data,s.pixelWidth,s.pixelHeight,s.pixelDepth),r.minFilter=i?er:St,r.magFilter=St,r.generateMipmaps=s.levelCount===0;else{if(s.pixelDepth>0)throw new Error("THREE.KTX2Loader: Unsupported pixelDepth.");r=new Pi(n,s.pixelWidth,s.pixelHeight),r.minFilter=i?Kt:Et,r.magFilter=Et}return r.mipmaps=n,r.type=Mr[e],r.format=eh[e],r.colorSpace=Cf(s),r.needsUpdate=!0,Promise.resolve(r)}function Cf(s){let e=s.dataFormatDescriptor[0];return e.colorPrimaries===1?e.transferFunction===2?nt:wt:e.colorPrimaries===10?e.transferFunction===2?Ud:Nd:e.colorPrimaries===0?Mn:(console.warn(`THREE.KTX2Loader: Unsupported color primaries, "${e.colorPrimaries}"`),Mn)}var Sf={type:"change"},ih={type:"start"},Tf={type:"end"},Qa=new kn,If=new yn,ny=Math.cos(70*qn.DEG2RAD),Dt=new w,cn=2*Math.PI,at={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},nh=1e-6,ka=class extends so{constructor(e,t=null){super(e,t),this.state=at.NONE,this.target=new w,this.cursor=new w,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Wn.ROTATE,MIDDLE:Wn.DOLLY,RIGHT:Wn.PAN},this.touches={ONE:An.ROTATE,TWO:An.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new w,this._lastQuaternion=new bt,this._lastTargetPosition=new w,this._quat=new bt().setFromUnitVectors(e.up,new w(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new js,this._sphericalDelta=new js,this._scale=1,this._panOffset=new w,this._rotateStart=new Se,this._rotateEnd=new Se,this._rotateDelta=new Se,this._panStart=new Se,this._panEnd=new Se,this._panDelta=new Se,this._dollyStart=new Se,this._dollyEnd=new Se,this._dollyDelta=new Se,this._dollyDirection=new w,this._mouse=new Se,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=sy.bind(this),this._onPointerDown=iy.bind(this),this._onPointerUp=ry.bind(this),this._onContextMenu=dy.bind(this),this._onMouseWheel=cy.bind(this),this._onKeyDown=ly.bind(this),this._onTouchStart=hy.bind(this),this._onTouchMove=uy.bind(this),this._onMouseDown=oy.bind(this),this._onMouseMove=ay.bind(this),this._interceptControlDown=fy.bind(this),this._interceptControlUp=py.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Sf),this.update(),this.state=at.NONE}update(e=null){let t=this.object.position;Dt.copy(t).sub(this.target),Dt.applyQuaternion(this._quat),this._spherical.setFromVector3(Dt),this.autoRotate&&this.state===at.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=cn:n>Math.PI&&(n-=cn),i<-Math.PI?i+=cn:i>Math.PI&&(i-=cn),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Dt.setFromSpherical(this._spherical),Dt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Dt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Dt.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new w(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new w(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Dt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Qa.origin.copy(this.object.position),Qa.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Qa.direction))<ny?this.object.lookAt(this.target):(If.setFromNormalAndCoplanarPoint(this.object.up,this.target),Qa.intersectPlane(If,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>nh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>nh||this._lastTargetPosition.distanceToSquared(this.target)>nh?(this.dispatchEvent(Sf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?cn/60*this.autoRotateSpeed*e:cn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Dt.setFromMatrixColumn(t,0),Dt.multiplyScalar(-e),this._panOffset.add(Dt)}_panUp(e,t){this.screenSpacePanning===!0?Dt.setFromMatrixColumn(t,1):(Dt.setFromMatrixColumn(t,0),Dt.crossVectors(this.object.up,Dt)),Dt.multiplyScalar(e),this._panOffset.add(Dt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let i=this.object.position;Dt.copy(i).sub(this.target);let r=Dt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),i=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=i/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(cn*this._rotateDelta.x/t.clientHeight),this._rotateUp(cn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(cn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-cn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(cn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-cn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panStart.set(n,i)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(cn*this._rotateDelta.x/t.clientHeight),this._rotateUp(cn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Se,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function iy(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s)))}function sy(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function ry(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Tf),this.state=at.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function oy(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Wn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=at.DOLLY;break;case Wn.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=at.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=at.ROTATE}break;case Wn.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=at.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=at.PAN}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(ih)}function ay(s){switch(this.state){case at.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case at.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case at.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function cy(s){this.enabled===!1||this.enableZoom===!1||this.state!==at.NONE||(s.preventDefault(),this.dispatchEvent(ih),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(Tf))}function ly(s){this.enabled!==!1&&this._handleKeyDown(s)}function hy(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case An.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=at.TOUCH_ROTATE;break;case An.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=at.TOUCH_PAN;break;default:this.state=at.NONE}break;case 2:switch(this.touches.TWO){case An.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=at.TOUCH_DOLLY_PAN;break;case An.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=at.TOUCH_DOLLY_ROTATE;break;default:this.state=at.NONE}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(ih)}function uy(s){switch(this._trackPointer(s),this.state){case at.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case at.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case at.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case at.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=at.NONE}}function dy(s){this.enabled!==!1&&s.preventDefault()}function fy(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function py(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Ga=(s,e,t,n,i,r)=>({name:s,description:e,affinity:t,leadership:n,citizenship:i,repression:r,science:1,workers:1,tax:1,happiness:0}),wf={federation:Ga("F\xF6derale Republik","Autonome Planeten teilen Au\xDFenpolitik und Forschung; lokale Parlamente verwalten Versorgung und Abgaben.","open","Planetarer Bundesrat","F\xF6derale B\xFCrgerrechte","Gering"),corporate:Ga("Konzernherrschaft","Unternehmensdirektorien f\xFChren Staat und Infrastruktur. Investitionen und Handelsvertr\xE4ge stehen im Zentrum.","commercial","Unternehmensdirektorien","Vertragsgebundener B\xFCrgerstatus","Mittel"),oligarchy:Ga("Oligarchie","Ein kleiner Rat einflussreicher H\xE4user kontrolliert Verwaltung und strategische Ressourcen.","traditional","Rat der Handelsh\xE4user","St\xE4ndische Beteiligung","Mittel"),theocracy:Ga("Theokratie","Religi\xF6se Institutionen tragen Regierung und soziale Versorgung; Forschung folgt verbindlichen Lehrgrunds\xE4tzen.","spiritual","Synode","Religi\xF6se Gemeinschaftsrechte","Hoch")};var sh={union:{name:"Republik Elara",species:"Elari",color:"#88bada",ideology:"democracy",goal:"Agrarhandel und offene Forschung",priority:"alloy",research:"colonies"},guild:{name:"Freie Gilden Taris",species:"Tari",color:"#c6c187",ideology:"corporate",goal:"Pr\xE4zisionsbauteile und Vertr\xE4ge",priority:"crystal",research:"trade"},clans:{name:"Kronbund Rauk",species:"Rauki",color:"#d4ac94",ideology:"monarchy",goal:"Mineralische Rohstoffe und stabile Lieferungen",priority:"medicine",research:"industry"},archive:{name:"Archivstaat Omnis",species:"Omnari",color:"#aaa3de",ideology:"technocracy",goal:"Forschungselektronik und Akademien",priority:"food",research:"science"},mandate:{name:"Flottenmandat Kass",species:"Kassi",color:"#98b3bd",ideology:"military",goal:"Brennstoffversorgung und Grenzsicherung",priority:"optics",research:"defense"},commons:{name:"Verbund der Kommunen",species:"Synari",color:"#c693a7",ideology:"communism",goal:"Konsumg\xFCter und gemeinschaftliche Versorgung",priority:"energy",research:"industry"},nomads:{name:"Freie Monde Sera",species:"Serari",color:"#99c7b0",ideology:"federation",goal:"Nahrungshandel und lokale Autonomie",priority:"electronics",research:"colonies"},forge:{name:"Stahlh\xE4user Doran",species:"Dorani",color:"#c0ad86",ideology:"oligarchy",goal:"Legierungsexport und industrielle Beteiligungen",priority:"goods",research:"industry"},nexus:{name:"Nexus-Handelsgesellschaft",species:"Menschen / Nexari",color:"#88c7b8",ideology:"corporate",goal:"Energievertr\xE4ge und Elektronikfertigung",priority:"crystal",research:"trade"},concord:{name:"F\xF6deration Concord",species:"Ilyri / Synari",color:"#96bde8",ideology:"federation",goal:"Nahrungssicherheit und autonome Kolonien",priority:"medicine",research:"colonies"},houses:{name:"H\xE4userbund Vey",species:"Veyari",color:"#ccac87",ideology:"oligarchy",goal:"Mineralienexport und metallurgische Investitionen",priority:"goods",research:"industry"},sanctum:{name:"Synode Sanctum",species:"Aelari",color:"#c2aae5",ideology:"theocracy",goal:"Gemeinschaftliche Versorgung und medizinische Entwicklung",priority:"electronics",research:"science"}},bf=[["union","Elara","helios","Ozeanisch",401,120,.7,1.05],["guild","Taris","vesper","Kristallwelt",413,145,1.1,1],["clans","Rauk","umbra","Vulkanisch",427,150,1.5,1.2],["archive","Omnis","aurora","Kristallwelt",439,135,.9,.95],["mandate","Kass","lyra","Eiswelt",451,160,1.2,.7],["commons","Koinon","draco","Temperiert",463,155,.95,1],["nomads","Sera","caelum","Ozeanisch",477,125,.8,1.1],["forge","Doran","erebus","Industriewelt",489,170,1.35,.85],["nexus","Nexus","aurora","Industriewelt",270,210,1.1,1.15],["concord","Concordia","lyra","Ozeanisch",283,190,.75,1],["houses","Vey Prime","draco","Vulkanisch",297,230,1.65,.9],["sanctum","Sanctum","orion","Temperiert",305,200,.9,1.1]].map(([s,e,t,n,i,r,o,a])=>({id:s,name:e,system:t,kind:n,seed:i,population:r,oreFactor:o,solarFactor:a,owner:s,color:sh[s].color,aliens:.8,orbit:{union:3,guild:2,clans:2,archive:4,mandate:4,commons:4,nomads:4,forge:4,sanctum:4}[s]??3,frontier:!0,expansion:!0}));var Rf={electronics:{name:"Elektronik",short:"ELE",color:"#8bceff",unlock:"electronics"},medicine:{name:"Medikamente",short:"MED",color:"#88dfbd",unlock:"biomedicine"},goods:{name:"Konsumwaren",short:"KON",color:"#f4b7df",unlock:"consumerCulture"},fuel:{name:"Reaktorbrennstoff",short:"BRE",color:"#ffbb85",unlock:"deuterium"}},Qt=(s,e,t,n,i,r,o,a,l,c,h={})=>({name:s,group:e,glyph:t,color:"#91b9ef",cost:n,days:5,workers:i,upkeep:r,input:o,output:a,requiredTech:l,description:c,...h}),Bf={tower:Qt("Vertikales Wohnhabitat","Bev\xF6lkerung","H\xB2",{credits:220,alloy:55,optics:12},0,2,{},{},"compactCities","180 Wohnpl\xE4tze auf einer Baufl\xE4che. Erschlie\xDFt dichte Industriekolonien.",{housing:180}),clinic:Qt("Planetare Klinik","Bev\xF6lkerung","+",{credits:160,alloy:30},6,3,{energy:2,medicine:.5},{},"biomedicine","Versorgte Kliniken erh\xF6hen Zufriedenheit um 5 und Wachstum um 10 %. Bis zu zwei Kliniken wirken.",{service:"health",unique:2}),civicCenter:Qt("Versorgungszentrum","Bev\xF6lkerung","V",{credits:180,alloy:35},6,3,{energy:2,goods:.6},{},"consumerCulture","\xD6rtliche Konsumversorgung: +5 Zufriedenheit und 5 % geringerer Nahrungsbedarf. Ein Zentrum je Planet.",{service:"civic",unique:1}),synthesis:Qt("Proteinsynthese","Versorgung","P",{credits:160,alloy:30,optics:10},8,3,{energy:8},{food:25},"hydroponics","Produziert auch auf Eis- und Vulkanwelten 25 Nahrung. Hoher Energiebedarf; unabh\xE4ngig vom Agrarertrag."),geothermal:Qt("Geothermiekraftwerk","Versorgung","G",{credits:180,alloy:45},10,3,{},{energy:38},"geothermal","38 Energie \xD7 Geothermiefaktor: Vulkanwelten eignen sich besonders gut.",{factor:"geothermal"}),fusionPlant:Qt("Deuterium-Fusionswerk","Versorgung","F",{credits:350,alloy:75,electronics:15},12,6,{fuel:1},{energy:95},"fusionPlants","Hoher Energieertrag mit einer Brennstoffkette statt Kristallverbrauch."),deepMine:Qt("Tiefenf\xF6rderanlage","Rohstoffe","T",{credits:180,alloy:45,optics:12},12,4,{energy:7},{ore:25},"precisionFab","25 Erz \xD7 \xF6rtlicher Erzgehalt. H\xF6herer Energiebedarf bei geringerem Personalbedarf als zwei Erzf\xF6rderer."),fuelExtractor:Qt("Deuteriumf\xF6rderer","Rohstoffe","D",{credits:200,alloy:40,optics:15},10,4,{energy:6},{fuel:5},"deuterium","F\xF6rdert Reaktorbrennstoff. Eis- und Ozeanwelten besitzen die h\xF6chsten Vorkommen.",{factor:"fuel"}),recycler:Qt("Materialrecycling","Industrie","\u21BB",{credits:220,alloy:45},8,4,{goods:2,energy:4},{alloy:3,ore:2},"recyclingPlant","Verarbeitet Konsumwaren zu Legierungen und Erz. Eine alternative Kette f\xFCr rohstoffarme Kolonien."),electronicsFactory:Qt("Elektronikfabrik","Industrie","E",{credits:210,alloy:50,optics:15},14,4,{optics:2,crystal:1,energy:5},{electronics:3},"electronics","Pr\xE4zisionsbauteile f\xFCr moderne Werften, Forschung und Reaktoren."),medicineFactory:Qt("Biopharmawerk","Industrie","B",{credits:190,alloy:40,crystal:10},12,4,{food:3,crystal:.5,energy:5},{medicine:4},"biomedicine","Versorgt Bev\xF6lkerung und Kliniken; medizinische G\xFCter sind auch auf fremden M\xE4rkten gefragt."),goodsFactory:Qt("Konsumg\xFCtermanufaktur","Industrie","K",{credits:170,alloy:35},12,3,{alloy:2,optics:.5,energy:4},{goods:6},"consumerCulture","Waren f\xFCr den Lebensstandard. Wohlhabende Gesellschaften ben\xF6tigen mehr davon."),academy:Qt("Ingenieursakademie","Wissenschaft","A",{credits:250,alloy:50,electronics:15},8,5,{energy:5,electronics:.3},{},"academies","Erzeugt 2 Forschung pro Tag und qualifiziert Personal: +6 % verf\xFCgbare Arbeitskr\xE4fte. Eine Akademie je Planet.",{science:2,service:"education",unique:1}),depot:Qt("Orbitales Versorgungsdepot","Raumfahrt","V",{credits:170,alloy:40},6,3,{energy:2},{},"supplyPorts","Verdoppelt die Grundrate beim Auff\xFCllen von Bordversorgung. Ein Depot je Planet.",{service:"supply",unique:1}),dryDock:Qt("Raumschiff-Reparaturdock","Raumfahrt","R",{credits:250,alloy:65,electronics:12},8,5,{energy:3},{},"dryDocks","Repariert 10 statt 4 H\xFCllenpunkte je Wartungstag; Legierungsverbrauch richtet sich nach der Reparatur.",{service:"repair",unique:1}),tradePort:Qt("Interstellarer Handelshafen","Raumfahrt","\u21C4",{credits:280,alloy:65,electronics:15},8,5,{energy:3},{},"tradePorts","Erweitert den Marktbestand um 25 % und verbessert Exportpreise deines Reichs um 4 %. Ein Hafen je Planet.",{service:"trade",unique:1}),embassy:Qt("Diplomatisches Forum","Wissenschaft","D",{credits:220,alloy:40,electronics:10},6,4,{energy:3},{},"advancedDiplomacy","Verbessert Gesandtschaften um 15 % und erm\xF6glicht Forschungs-, Hafen- und Beistandsabkommen.",{service:"diplomacy",unique:1})},Df={bulkFreighter:{name:"Massengutfrachter",color:"#edbf8b",cost:{credits:600,alloy:160,electronics:25,fuel:25},days:10,strength:0,armor:.15,speed:.85,upkeep:4,troops:0,cargo:600,requiredTech:"bulkFreighters",description:"600 Fracht f\xFCr kontinuierliche Versorgung und mehrere Handelsstopps."},superFreighter:{name:"Interstellarer Megafrachter",color:"#b6d6ff",cost:{credits:1400,alloy:320,electronics:60,fuel:60},days:15,strength:0,armor:.2,speed:.75,upkeep:8,troops:0,cargo:1400,requiredTech:"superFreighters",description:"1400 Fracht. Gro\xDFe Lieferkreisl\xE4ufe f\xFCr entwickelte Kolonien; hoher Unterhalt."}};var Zn=(s,e,t,n,i,r,o,a,l,c,h)=>({name:s,glyph:e,color:t,cost:n,days:i,workers:r,upkeep:o,input:a,requiredTech:l,group:"Planetare Basen",...c,description:h}),Ff={bunker:Zn("Planetare Festung","B","#a7b8de",{credits:160,alloy:45},5,8,3,{energy:2},"fortification",{fortification:35},"Verst\xE4rkt die Garnison um 35 Verteidigungspunkte. Muss versorgt sein."),orbitalGun:Zn("Orbitale Lanzenbatterie","G","#f2ab9c",{credits:260,alloy:70,optics:20,weapons:25},7,14,5,{energy:5},"orbitalArtillery",{orbital:30},"30 zus\xE4tzliche Orbitalverteidigung. Angreifer m\xFCssen die Batterie ausschalten."),interceptor:Zn("Abfangnetz","I","#97bfff",{credits:280,alloy:65,optics:25},7,12,5,{energy:4},"interception",{interception:.25},"F\xE4ngt 25 % des ankommenden Raketenangriffs ab; mehrere Netze wirken bis 75 %."),shield:Zn("Planetarer Schildgenerator","D","#a6a8ff",{credits:350,alloy:80,crystal:40,optics:25},8,14,7,{energy:8},"shieldPhysics",{shield:180,regen:12},"180 Schildpunkte und 12 Regeneration pro Tag. Sch\xFCtzt gegen Flotten und strategische Angriffe."),missileSilo:Zn("Subraum-Raketensilo","M","#e3a0cf",{credits:320,alloy:85,weapons:30,optics:20},8,14,6,{energy:5},"missileDoctrine",{launcher:!0},"Bereitet planetare Fernangriffe vor. Munition wird pro Auftrag bezahlt."),reactor:Zn("Kolosse-Reaktor","R","#ffcf98",{credits:900,alloy:180,crystal:90,optics:50},12,24,12,{crystal:2},"colossalReactors",{output:{energy:150}},"Gro\xDFe Energiequelle f\xFCr Schildnetze und Megawaffen. Verbraucht t\xE4glich Kristalle."),worldShield:Zn("Weltenschild","S","#bcb2ff",{credits:2200,alloy:500,crystal:260,optics:180},18,28,24,{energy:35},"worldShield",{shield:1600,regen:55},"1600 Schildpunkte. Kann sogar einen Weltenbrecher abfangen, wenn vollst\xE4ndig geladen."),stellarAegis:Zn("Stellare \xC4gis","A","#8bbcff",{credits:5500,alloy:1100,crystal:650,optics:350},24,36,45,{energy:70},"phaseAnchors",{shield:2800,regen:85,starBarrier:3e3},"Sch\xFCtzt den ganzen Stern mit 3000 zus\xE4tzlichen Barrierepunkten. Muss beim Einschlag versorgt sein."),planetLance:Zn("Graviton-Weltenlanze","P","#ff98ba",{credits:48e3,alloy:1400,crystal:800,weapons:600,optics:350},24,40,55,{energy:80},"annihilator",{launcher:!0},"L\xE4dt einen Weltenbrecher. Ungesch\xFCtzte Zielplaneten werden dauerhaft zu Tr\xFCmmerfeldern."),stellarForge:Zn("Stellare Resonanzschmiede","X","#f5a8ff",{credits:12e4,alloy:3e3,crystal:1800,weapons:1e3,optics:900},30,56,95,{energy:140},"starBreaker",{launcher:!0},"Endspielanlage f\xFCr Sternenbrecher. Ein ungesch\xFCtzter Stern und alle seine Planeten gehen verloren.")};var Lf=[{id:"silex",name:"Silex",x:.18,y:.88,color:"#8fbbdf",uncharted:!0,description:"Ein kalter Stern au\xDFerhalb der kartierten Sprungkorridore."},{id:"meridian",name:"Meridian",x:.5,y:.88,color:"#f1c596",uncharted:!0,description:"Ein abgelegenes System mit starken thermischen Signaturen."},{id:"vestra",name:"Vestra",x:.82,y:.88,color:"#bea5ef",uncharted:!0,description:"Ein schwaches Signal jenseits der bekannten Handelswege."}],Pf=[["silex","Frostfall","Eiswelt","#9bbfcf",1.45,.55],["silex","Tern","Temperiert","#83a69c",.85,.85],["silex","Prisma","Kristallwelt","#bda1de",1.1,.7],["meridian","Caldera","Vulkanisch","#dd9c70",1.7,1.25],["meridian","Oasis","Ozeanisch","#7fa8d1",.7,1.15],["meridian","Vela","Temperiert","#a1b2a0",1.05,1.1],["vestra","Silva","Temperiert","#86b3a7",.95,.95],["vestra","Kryos","Eiswelt","#a5bccf",1.3,.65],["vestra","Facet","Kristallwelt","#b097d6",1.2,.8]].map(([s,e,t,n,i,r],o)=>({id:`${s}-${o%3}`,name:e,system:s,owner:null,kind:t,color:n,oreFactor:i,solarFactor:r,seed:310+o*17,population:0,aliens:0,orbit:o%3})),Uf={commCenter:{name:"Kommunikationszentrale",group:"Wissenschaft",glyph:"C",color:"#94aaca",cost:{credits:90,alloy:24,optics:8},days:4,workers:6,upkeep:2,input:{energy:2},requiredTech:"communications",unique:1,service:"communication",description:"\xD6ffnet den reichsweiten Posteingang. Die Dachzahl zeigt g\xFCltige, unbeantwortete Anfragen und Angebote. Maximal eine Zentrale je Planet."}},Nf={probe:{name:"Analysesonde",color:"#a7bce9",requiredTech:"planetaryAnalysis",cost:{credits:55,alloy:12,optics:10,energy:8},days:2,strength:0,armor:0,speed:1.2,upkeep:1,troops:0,cargo:0,description:"Untersucht Geologie und Oberfl\xE4che manuell. Scan: 60 Credits, 8 Energie, 2 Optik und 6 Tage zus\xE4tzlich zur Reise. Keine Bev\xF6lkerungs-, Regierungs- oder Milit\xE4rdaten."}};var kt=(s,e,t,n,i,r,o={},a="")=>({name:s,branch:e,tier:t,cost:n,days:i,requires:r,effects:o,unlock:a}),Of={geothermal:kt("Geothermische Erschlie\xDFung","energy",2,65,5,["grid"],{},"Geothermiekraftwerke"),deuterium:kt("Deuteriumseparation","energy",3,100,6,["fusion"],{},"Brennstofff\xF6rderer und neuer Rohstoff"),fusionPlants:kt("Industrielle Deuteriumfusion","energy",4,180,8,["deuterium","electronics"],{},"Deuterium-Fusionswerke"),electronics:kt("Integrierte Schaltkreise","industry",3,110,6,["precisionFab"],{},"Elektronikfertigung"),recyclingPlant:kt("Stoffliche Kreislaufwirtschaft","industry",4,160,7,["precisionFab","consumerCulture"],{},"Materialrecycling"),biomedicine:kt("Xenobiomedizin","colonies",3,90,6,["hydroponics"],{},"Medikamente, Kliniken und Gesundheitsversorgung"),consumerCulture:kt("Planetarer Lebensstandard","colonies",2,75,5,["habitats"],{},"Konsumwaren und Versorgungszentren"),academies:kt("Ingenieursausbildung","science",3,120,7,["computing","electronics"],{},"Ingenieursakademien"),supplyPorts:kt("Orbitale Hafenlogistik","propulsion",2,60,4,["engineTuning"],{},"Versorgungsdepots"),dryDocks:kt("Modulare Trockendocks","propulsion",3,110,6,["supplyPorts","precisionFab"],{},"Reparaturdocks"),tradePorts:kt("Planetare Warenb\xF6rsen","trade",3,110,6,["logistics","electronics"],{},"Handelsh\xE4fen"),tradeCircuits:kt("Mehrstufige Handelskreisl\xE4ufe","trade",3,100,6,["logistics"],{},"Handelsrouten mit bis zu sechs Stopps"),smartLogistics:kt("Bedarfsgesteuerte Logistik","trade",4,180,8,["tradeCircuits","supplyPorts"],{supply:1.1},"Automatische Versorgungsreserve und acht Handelsstopps"),bulkFreighters:kt("Massengut-Raumrahmen","trade",4,190,8,["tradeCircuits","electronics"],{},"Massengutfrachter mit 600 Fracht"),superFreighters:kt("Interstellare Frachtarchitektur","trade",5,320,11,["bulkFreighters","deuterium"],{},"Megafrachter mit 1400 Fracht"),advancedDiplomacy:kt("Interstellare Vertragsdiplomatie","trade",4,170,8,["communications","computing"],{},"Diplomatische Foren und weitere Abkommen"),politicalReforms:kt("Institutionelle Reformverfahren","science",3,130,7,["computing"],{reformCost:.94},"Weitergehende Gesetze und politische Reformprogramme")};var Nt=(s,e,t,n,i,r,o,a)=>({name:s,branch:e,tier:t,cost:n,days:i,requires:r,effects:o,description:a}),Qf={fortresses:{name:"Festungen",color:"#9fbaff",description:"Bunker, Abfangnetze und planetare Schirme."},ordnance:{name:"Fernwaffen",color:"#ff9ab7",description:"Fernraketen, Fusionsangriffe und Weltenbrecher."},megastructures:{name:"Megabauten",color:"#d4a0ff",description:"Gro\xDFreaktoren, Sternenschilde und stellare Waffen."}},kf={fortification:Nt("Planetare Befestigungen","fortresses",1,80,5,["targeting"],{},"Schaltet Planetare Festungen frei."),orbitalArtillery:Nt("Orbitale Artillerie","fortresses",2,220,8,["fortification","precisionFab"],{},"Schaltet orbitale Lanzenbatterien frei."),shieldPhysics:Nt("Makroskopische Schildfelder","fortresses",3,350,10,["orbitalArtillery","fusion"],{},"Schaltet planetare Schildgeneratoren frei."),interception:Nt("Subraum-Abfangnetze","fortresses",3,330,10,["orbitalArtillery","computing"],{},"Schaltet Raketen-Abfangnetze frei."),worldShield:Nt("Weltenschild-Theorie","fortresses",4,1500,20,["shieldPhysics","smartGrid"],{},"Schaltet den Weltenschild frei."),shieldResonance:Nt("Resonante Schildverb\xFCnde","fortresses",5,2600,26,["worldShield","interception"],{shieldCapacity:1.15,shieldRegen:1.2},"Verbessert die Schildnetze deiner Kolonien."),missileDoctrine:Nt("Planetare Fernschl\xE4ge","ordnance",1,120,6,["targeting"],{},"Schaltet Subraum-Raketensilos und Tachyon-Fernraketen frei."),fusionWarheads:Nt("Fusionsbelagerung","ordnance",2,450,10,["missileDoctrine","fusion"],{},"Schaltet Fusionssprengk\xF6pfe frei."),siegeGuidance:Nt("Interstellare Feuerleitung","ordnance",3,600,12,["missileDoctrine","computing"],{strikePower:1.15},"Verbessert strategische Angriffe."),deepRange:Nt("Tiefenraum-Zielnetze","ordnance",3,800,14,["siegeGuidance","propulsion"],{strikeRange:1.8},"Vergr\xF6\xDFert die Reichweite der Fernwaffen."),antimatterDoctrine:Nt("Antimaterie-Belagerung","ordnance",4,1600,20,["fusionWarheads","plasma"],{},"Schaltet Antimaterie-Salven frei."),annihilator:Nt("Graviton-Kollapsfelder","ordnance",5,4500,28,["antimatterDoctrine","gates","quantumModels"],{},"Schaltet die Graviton-Weltenlanze und den Weltenbrecher frei."),orbitalMegas:Nt("Orbitale Megabauweise","megastructures",1,180,8,["precisionFab","fusion"],{},"Grundlage gro\xDFer Energie- und Sternenanlagen."),colossalReactors:Nt("Kolosse-Reaktoren","megastructures",2,700,12,["orbitalMegas","plasma"],{},"Schaltet den Kolosse-Reaktor frei."),phaseAnchors:Nt("Stellare Phasenanker","megastructures",3,1200,16,["colossalReactors","computing"],{},"Schaltet die Stellare \xC4gis frei: Gegenwehr gegen Sternenbrecher."),stellarDynamics:Nt("Kontrollierte Sterndynamik","megastructures",3,2200,20,["colossalReactors","dataNetwork"],{},"Grundlage stellarer Resonanzanlagen."),singularityControl:Nt("Singularit\xE4tskontrolle","megastructures",4,3500,24,["stellarDynamics","quantumModels"],{},"Voraussetzung f\xFCr die gr\xF6\xDFte Megawaffe."),starBreaker:Nt("Stellare Resonanztechnik","megastructures",5,6500,30,["singularityControl","annihilator"],{},"Schaltet die Stellare Resonanzschmiede und den Sternenbrecher frei.")};var Ov={...Qf,energy:{name:"Energie",color:"#ffd185",description:"Ertrag, Netze und sparsame Versorgung."},industry:{name:"Industrie",color:"#8ea7ff",description:"Rohstoffe, Fertigung und Materialeffizienz."},colonies:{name:"Kolonien",color:"#91cbff",description:"Wohnraum, Ern\xE4hrung und Wachstum."},science:{name:"Wissenschaft",color:"#b7a1ff",description:"Laborertrag und Entwicklungszeit."},propulsion:{name:"Raumfahrt",color:"#70cfff",description:"Reisezeit, Treibstoff und Erkundung."},defense:{name:"Flotten",color:"#ff98b7",description:"Zielsysteme, Panzerung und Einsatzlogistik."},trade:{name:"Handel",color:"#edbbff",description:"Frachtraum, Exporterl\xF6se und Diplomatie."}},Fe=(s,e,t,n,i,r,o,a={})=>({name:s,branch:e,tier:t,cost:n,days:i,requires:r,effects:o,...a}),Ay={...kf,...Of,grid:Fe("Orbitales Energienetz","energy",1,35,3,[],{energy:1.05}),fusion:Fe("Fusionsregelung","energy",2,65,5,["grid"],{energy:1.06}),photovoltaics:Fe("Spektrale Solarfelder","energy",3,115,6,["fusion"],{energy:1.08},{excludes:["reactorLoops"],focus:"Hoher Ertrag"}),reactorLoops:Fe("Geschlossene Reaktorkreisl\xE4ufe","energy",3,115,6,["fusion"],{energy:1.04,inputEnergy:.94},{excludes:["photovoltaics"],focus:"Niedriger Verbrauch"}),smartGrid:Fe("Lastverteilung","energy",4,180,8,["mineralScan"],{inputEnergy:.95},{requiresAny:["photovoltaics","reactorLoops"]}),plasma:Fe("Plasmastabilisierung","energy",5,300,11,["smartGrid","labMethods"],{energy:1.08}),mineralScan:Fe("Mineralische Tiefenscans","industry",1,40,3,[],{ore:1.05,crystal:1.05}),planetaryAnalysis:Fe("Planetare Analyseverfahren","science",2,45,3,["mineralScan","engineTuning"],{},{unlock:"Analysesonden: manuelle Geologie- und Oberfl\xE4chenscans"}),precisionFab:Fe("Pr\xE4zisionsfertigung","industry",2,75,5,["mineralScan"],{alloy:1.05,optics:1.05}),massProduction:Fe("Serienfertigung","industry",3,125,6,["precisionFab"],{alloy:1.08,ore:1.04},{excludes:["nanoFab"],focus:"Massenproduktion"}),nanoFab:Fe("Nanofertigung","industry",3,125,6,["precisionFab"],{optics:1.08,weapons:1.05},{excludes:["massProduction"],focus:"Pr\xE4zisionsg\xFCter"}),recycling:Fe("Industrielle R\xFCckgewinnung","industry",4,190,8,["grid"],{inputOre:.95,inputAlloy:.95},{requiresAny:["massProduction","nanoFab"]}),automation:Fe("Autonome Fabrikverb\xFCnde","industry",5,310,11,["recycling","computing"],{workers:1.05,buildingUpkeep:.94}),habitats:Fe("Adaptive Habitate","colonies",1,35,3,[],{housing:1.06,growth:1.05}),hydroponics:Fe("Kreislauf-Hydroponik","colonies",2,65,5,["habitats"],{food:1.07}),compactCities:Fe("Vertikale Siedlungen","colonies",3,110,6,["hydroponics"],{housing:1.1},{excludes:["biospheres"],focus:"Dichte St\xE4dte"}),biospheres:Fe("Offene Biosph\xE4ren","colonies",3,110,6,["hydroponics"],{foodDemand:.95,growth:1.1},{excludes:["compactCities"],focus:"Versorgte Siedlungen"}),closedHabitats:Fe("Geschlossene Lebenskreisl\xE4ufe","colonies",4,170,8,["mineralScan"],{foodDemand:.95,inputEnergy:.96},{requiresAny:["compactCities","biospheres"]}),ecologies:Fe("Planetare \xD6kologien","colonies",5,290,10,["closedHabitats","smartGrid"],{growth:1.1,housing:1.08}),labMethods:Fe("Reproduzierbare Laborverfahren","science",1,40,3,[],{science:1.06}),computing:Fe("Verteilte Rechenkerne","science",2,80,5,["labMethods"],{researchTime:.94}),basicTheory:Fe("Grundlageninstitut","science",3,130,6,["computing"],{science:1.08},{excludes:["appliedEngineering"],focus:"Grundlagen"}),appliedEngineering:Fe("Angewandte Ingenieurskunst","science",3,130,6,["computing"],{shipTime:.95,inputEnergy:.97},{excludes:["basicTheory"],focus:"Anwendung"}),dataNetwork:Fe("Interstellare Datennetze","science",4,200,8,["communications"],{science:1.06},{requiresAny:["basicTheory","appliedEngineering"]}),quantumModels:Fe("Quantenmodellierung","science",5,330,12,["dataNetwork","precisionFab"],{researchTime:.92,science:1.05}),engineTuning:Fe("Antriebsabstimmung","propulsion",1,40,3,[],{travelTime:.96}),propulsion:Fe("Sprungantrieb II","propulsion",2,80,5,["engineTuning"],{travelTime:.95}),fastJumps:Fe("Kurzzeit-Sprungfelder","propulsion",3,135,6,["propulsion"],{travelTime:.92},{excludes:["ecoDrive"],focus:"Geschwindigkeit"}),ecoDrive:Fe("\xD6konomische Sprungantriebe","propulsion",3,135,6,["propulsion"],{fuel:.9,travelSupply:.8},{excludes:["fastJumps"],focus:"Reichweite"}),navigation:Fe("Pr\xE4diktive Navigation","propulsion",4,205,8,["computing"],{travelTime:.96,survey:1.1},{requiresAny:["fastJumps","ecoDrive"]}),gates:Fe("Resonante Sprungkorridore","propulsion",5,340,12,["navigation","fusion"],{travelTime:.92,shipTime:.96}),targeting:Fe("Sensorfusion","defense",1,45,3,[],{combat:1.05}),lasers:Fe("Koh\xE4rente Laser","defense",2,85,5,["targeting"],{combat:1.06}),precisionFire:Fe("Pr\xE4zisionsfeuerleitung","defense",3,140,6,["lasers"],{combat:1.07},{excludes:["shielding"],focus:"Feuerkraft"}),shielding:Fe("Mehrschicht-Panzerung","defense",3,140,6,["lasers"],{armor:.05},{excludes:["precisionFire"],focus:"\xDCberlebensf\xE4higkeit"}),battleLogistics:Fe("Einsatzlogistik","defense",4,210,8,["engineTuning"],{fleetUpkeep:.95,supply:1.1},{requiresAny:["precisionFire","shielding"]}),coordination:Fe("Vernetzte Flottenf\xFChrung","defense",5,350,12,["battleLogistics","computing"],{combat:1.06,armor:.02}),communications:Fe("Subraum-Kommunikation","trade",1,35,3,[],{envoy:1.06},{unlock:"Kommunikationszentrale und diplomatischer Posteingang"}),newsNetwork:Fe("\xD6ffentliches Subraum-Nachrichtennetz","science",3,140,6,["communications","computing"],{},{unlock:"Space News in einer versorgten Kommunikationszentrale"}),logistics:Fe("Modulare Frachtr\xE4ume","trade",2,70,5,["communications"],{cargoCapacity:1.1}),merchant:Fe("Handelsgilden","trade",3,120,6,["logistics"],{trade:1.1},{excludes:["charter"],focus:"Export"}),charter:Fe("Charterverb\xE4nde","trade",3,120,6,["logistics"],{fleetUpkeep:.94,cargoCapacity:1.05},{excludes:["merchant"],focus:"Transport"}),contracts:Fe("Planetare Vertragsnetze","trade",4,180,8,["habitats"],{trade:1.05,tax:1.03},{requiresAny:["merchant","charter"]}),tradeNexus:Fe("Interstellarer Handelsverbund","trade",5,300,11,["contracts","propulsion"],{trade:1.08,cargoCapacity:1.08})};var my={...Rf,food:{name:"Nahrung",short:"NAH",color:"#c7d69c"},ore:{name:"Erz",short:"ERZ",color:"#bdab94"},alloy:{name:"Legierungen",short:"LEG",color:"#b5c9d9"},energy:{name:"Energie",short:"ENE",color:"#eab871"},crystal:{name:"Kristalle",short:"KRI",color:"#bb9bec"},optics:{name:"Optische Bauteile",short:"OPT",color:"#76cace"},weapons:{name:"Laserwaffen",short:"LAS",color:"#e58c8b"}},zv={...Uf,...Ff,...Bf,habitat:{name:"Wohnquartier",group:"Bev\xF6lkerung",glyph:"H",color:"#a1c7d2",cost:{credits:60,alloy:18},days:3,workers:0,upkeep:1,housing:80,description:"Wohnraum f\xFCr 80 Einwohner. Versorgte St\xE4dte ziehen neue Bewohner an."},farm:{name:"Hydroponik",group:"Versorgung",glyph:"F",color:"#a8c885",cost:{credits:45,alloy:12},days:2,workers:12,upkeep:2,input:{energy:2},output:{food:16},description:"Energie wird zu Nahrung. Jeder Einwohner ben\xF6tigt t\xE4glich 0,05 Einheiten."},solar:{name:"Solarfeld",group:"Versorgung",glyph:"E",color:"#ecc27f",cost:{credits:50,alloy:15},days:2,workers:6,upkeep:1,output:{energy:26},description:"Versorgt Fabriken und Schiffe mit Energie. Der Ertrag h\xE4ngt vom Planeten ab."},mine:{name:"Erzf\xF6rderer",group:"Rohstoffe",glyph:"M",color:"#b5a48d",cost:{credits:65,alloy:16},days:3,workers:18,upkeep:2,input:{energy:2},output:{ore:14},description:"F\xF6rdert Erz. Der Ertrag h\xE4ngt von den \xF6rtlichen Vorkommen ab."},crystal:{name:"Kristallmine",group:"Rohstoffe",glyph:"K",color:"#b49ad5",cost:{credits:80,alloy:22},days:3,workers:16,upkeep:3,input:{energy:3},output:{crystal:5},description:"Gewinnt Kristalle f\xFCr Laser und fortschrittliche Antriebe."},foundry:{name:"Schmelzwerk",group:"Industrie",glyph:"S",color:"#c3b3a1",cost:{credits:90,alloy:20},days:4,workers:16,upkeep:3,input:{ore:8,energy:5},output:{alloy:5},description:"Verarbeitet Erz und Energie zu Legierungen f\xFCr Geb\xE4ude und Schiffe."},optics:{name:"Optikfabrik",group:"Industrie",glyph:"O",color:"#85c6cb",cost:{credits:80,alloy:24},days:3,workers:12,upkeep:3,input:{ore:2,energy:4},output:{optics:3},description:"Pr\xE4zisionsbauteile f\xFCr Laserwaffen und Raumschiffe."},laser:{name:"Laserfabrik",group:"Industrie",glyph:"L",color:"#d58e8a",cost:{credits:110,alloy:28},days:4,workers:18,upkeep:4,input:{alloy:3,optics:2,crystal:1,energy:5},output:{weapons:3},description:"Eine vollst\xE4ndige Produktionskette f\xFCr die Bewaffnung deiner Flotte."},lab:{name:"Forschungslabor",group:"Wissenschaft",glyph:"R",color:"#9bace0",cost:{credits:85,alloy:22},days:3,workers:12,upkeep:4,input:{energy:4},science:4,description:"Erzeugt Forschungspunkte. Forschungspolitik und wissenschaftliche Infrastruktur beeinflussen den Ertrag."},shipyard:{name:"Raumwerft",group:"Milit\xE4r",glyph:"W",color:"#7fadb8",cost:{credits:140,alloy:45},days:5,workers:16,upkeep:5,input:{energy:2},description:"Baut zw\xF6lf spezialisierte Klassen von Raumfahrzeugen. Baupl\xE4ne werden durch Forschung erschlossen."}},Wv={...wf,democracy:{name:"Demokratie",description:"Gew\xE4hlte Regierung, politische Opposition und gleiche B\xFCrgerrechte f\xFCr alle Spezies.",science:1,workers:1,tax:1,happiness:0,affinity:"open",citizenship:"Gleiche B\xFCrgerrechte",leadership:"Gew\xE4hlte Regierung",repression:"Gering",term:60},communism:{name:"Kommunismus",description:"Staatliche Produktion und zentral gelenkte Versorgung. Politischer Wettbewerb ist eingeschr\xE4nkt.",science:1,workers:1,tax:1,happiness:0,affinity:"collective",citizenship:"Gleiche wirtschaftliche Rechte",leadership:"Zentralrat",repression:"Hoch"},monarchy:{name:"Monarchie",description:"Erbliche Herrschaft mit st\xE4ndischer Ordnung und begrenzter politischer Beteiligung.",science:1,workers:1,tax:1,happiness:0,affinity:"traditional",citizenship:"Untertanenstatus",leadership:"Erbliches Staatsoberhaupt",repression:"Mittel"},military:{name:"Milit\xE4rdiktatur",description:"Eine milit\xE4rische F\xFChrung kontrolliert Regierung und Opposition. Mobilisierung hat Vorrang.",science:1,workers:1,tax:1,happiness:0,affinity:"authoritarian",citizenship:"Milit\xE4risch verwaltet",leadership:"Milit\xE4rrat",repression:"Hoch"},technocracy:{name:"Technokratie",description:"Fachgremien bestimmen Forschung und Ressourcenverteilung. Direkte Mitbestimmung ist begrenzt.",science:1,workers:1,tax:1,happiness:0,affinity:"technical",citizenship:"Leistungsbezogener Zugang",leadership:"Fachgremien",repression:"Mittel"},nationalSocialism:{name:"Nationalsozialismus",description:"F\xFChrerprinzip, politische Repression, expansionistische Ziele und eine rassistische Spezieshierarchie.",science:1,workers:1,tax:1,happiness:0,affinity:"supremacist",citizenship:"Hierarchischer B\xFCrgerstatus",leadership:"F\xFChrerprinzip",repression:"Sehr hoch"}},gy={...Nf,...Df,scout:{requiredTech:"engineTuning",name:"Erkunder",color:"#a9dce1",cost:{credits:65,alloy:20,optics:8,energy:10},days:3,strength:0,armor:0,speed:1.5,upkeep:1,troops:0,cargo:0,description:"Kartiert neue Flugrouten und pr\xFCft Bewohnung aus sicherer Entfernung. Liefert keine Regierungs-, Oberfl\xE4chen- oder Milit\xE4rdaten. Zieht sich bei bewohnten Welten zur\xFCck; aggressive Bewohner k\xF6nnen das Schiff zerst\xF6ren."},destroyer:{requiredTech:"lasers",name:"Laserzerst\xF6rer",color:"#e1a38b",cost:{credits:230,alloy:80,optics:20,weapons:30,energy:30},days:7,strength:36,armor:.2,speed:1,upkeep:3,troops:0,cargo:0,description:"Schwerer Begleitschutz mit 20 % Schadensreduktion und 36 Grundst\xE4rke."},cruiser:{requiredTech:"coordination",name:"Schlachtkreuzer",color:"#bd9cdc",cost:{credits:420,alloy:140,optics:35,weapons:55,energy:50},days:10,strength:65,armor:.35,speed:.8,upkeep:6,troops:0,cargo:0,description:"65 Grundst\xE4rke und 35 % Schadensreduktion. Langsam und teuer im Unterhalt."},heavyFreighter:{requiredTech:"logistics",name:"Gro\xDFfrachter",color:"#e4c893",cost:{credits:190,alloy:65,energy:25},days:6,strength:0,armor:.1,speed:.8,upkeep:2,troops:0,cargo:200,description:"Transportiert 200 Waren pro Reise. Gr\xF6\xDFere Lieferung bei l\xE4ngerer Reisezeit."},support:{requiredTech:"supplyPorts",name:"Versorgungsschiff",color:"#9dc9a4",cost:{credits:140,alloy:45,optics:8,energy:35},days:5,strength:0,speed:1,upkeep:2,troops:0,cargo:0,description:"\xDCbertr\xE4gt t\xE4glich bis zu 12 eigene Versorgung auf andere station\xE4re Schiffe im selben Orbit."},corvette:{name:"Laserkorvette",color:"#82c4ca",cost:{credits:130,alloy:45,optics:12,weapons:12,energy:20},days:5,strength:18,troops:0,cargo:0,description:"Sichert den Orbit und bek\xE4mpft gegnerische Flotten."},freighter:{name:"Frachter",color:"#d7b78e",cost:{credits:80,alloy:28,energy:12},days:4,strength:0,troops:0,cargo:80,description:"Transportiert bis zu 80 Waren und kann eine feste Route bedienen."},colony:{requiredTech:"habitats",name:"Kolonieschiff",color:"#acd39f",cost:{credits:150,alloy:55,food:40,energy:20},days:6,strength:0,troops:0,cargo:0,settlers:40,description:"Gr\xFCndet mit 40 Einwohnern eine Siedlung auf einem unbewohnten Planeten."},lander:{requiredTech:"fortification",name:"Landungsschiff",color:"#d49791",cost:{credits:120,alloy:35,weapons:18,food:20,energy:15},days:5,strength:2,troops:40,cargo:0,settlers:40,description:"Besetzt einen feindlichen Planeten, wenn seine Orbitalverteidigung besiegt ist."}},Gf=[{id:"helios",name:"Helios",x:.18,y:.14,color:"#e6bc78",description:"Die Wiege deiner Zivilisation."},{id:"vesper",name:"Vesper",x:.5,y:.14,color:"#aba1e3",description:"Kristallreiche Welten und fremde Gesellschaften."},{id:"umbra",name:"Umbra",x:.82,y:.14,color:"#da8e72",description:"Eine umk\xE4mpfte industrielle Grenzregion."}],Hf=[["aurora","Aurora",.18,.44,"#96b8fa"],["lyra","Lyra",.5,.44,"#e6a8dc"],["draco","Draco",.82,.44,"#ffac91"],["orion","Orion",.18,.74,"#b7a3fc"],["caelum","Caelum",.5,.74,"#a8d3eb"],["erebus","Erebus",.82,.74,"#eece8e"]].map(([s,e,t,n,i])=>({id:s,name:e,x:t,y:n,color:i,description:"Grenzsystem mit neuen Kolonien und befestigten Au\xDFenposten."}));Gf.push(...Hf,...Lf);for(let s of Gf)s.uncharted||(s.y=s.y<.3?.13:s.y<.6?.38:.63);var rh=[{id:"nereid",name:"Nereid",system:"helios",owner:"player",kind:"Temperiert",color:"#7892d9",seed:31,oreFactor:1,solarFactor:1,population:180,aliens:.12,orbit:0},{id:"cinder",name:"Cinder",system:"helios",owner:null,kind:"Vulkanisch",color:"#d98d63",seed:72,oreFactor:1.6,solarFactor:1.15,population:0,aliens:0,orbit:1},{id:"thalassa",name:"Thalassa",system:"helios",owner:"ilyri",kind:"Ozeanisch",color:"#7aa5d8",seed:21,oreFactor:.8,solarFactor:.9,population:150,aliens:.9,orbit:2},{id:"veyra",name:"Veyra",system:"vesper",owner:"khepri",kind:"Kristallwelt",color:"#b798cf",seed:18,oreFactor:1.2,solarFactor:1,population:200,aliens:.95,orbit:0},{id:"elys",name:"Elys",system:"vesper",owner:null,kind:"Temperiert",color:"#90bfa1",seed:47,oreFactor:.8,solarFactor:1.2,population:0,aliens:0,orbit:1},{id:"aster",name:"Aster",system:"umbra",owner:"aster",kind:"Industriewelt",color:"#b49a81",seed:84,oreFactor:1.4,solarFactor:.85,population:240,aliens:.18,orbit:0},{id:"nox",name:"Nox",system:"umbra",owner:null,kind:"Eiswelt",color:"#95b4c1",seed:65,oreFactor:1.3,solarFactor:.65,population:0,aliens:0,orbit:1}],_y=[["Solace","Ember","Pelagos"],["Lumen","Aeris","Iris"],["Ferrum","Pyra","Dusk"],["Arcadia","Rime","Halo"],["Cobalt","Verdant","Haven"],["Obsidian","Ash","Zenith"]];Hf.forEach((s,e)=>{for(let t=0;t<3;t++)rh.push({id:`${s.id}-${t}`,name:_y[e][t],system:s.id,owner:null,kind:["Temperiert","Vulkanisch","Kristallwelt"][t],color:["#82a0d4","#d69a7b","#b19cd9"][t],seed:110+e*13+t*7,oreFactor:.8+e%3*.25+t*.2,solarFactor:.75+e%2*.25+t*.15,population:0,aliens:0,orbit:t,frontier:!0})});rh.push({id:"corona",name:"Corona",system:"orion",owner:"corona",kind:"Temperiert",color:"#e9cd95",seed:230,oreFactor:.85,solarFactor:1.1,population:220,aliens:.3,orbit:3,frontier:!0},{id:"collective",name:"Synara",system:"caelum",owner:"collective",kind:"Industriewelt",color:"#e3a8bb",seed:241,oreFactor:1.15,solarFactor:.9,population:260,aliens:.7,orbit:3,frontier:!0},{id:"vanguard",name:"Bastion",system:"erebus",owner:"vanguard",kind:"Eiswelt",color:"#9ac9c1",seed:252,oreFactor:1.2,solarFactor:.7,population:240,aliens:.4,orbit:3,frontier:!0});rh.push(...Pf,...bf);var Kv=Object.keys(my),Xv={...sh,corona:{name:"Sternenkrone Corona",species:"Menschen / Ilyri",color:"#e9cd95",ideology:"monarchy",goal:"Versorgung und stabile Handelsverbindungen",priority:"goods",research:"colonies"},collective:{name:"Synarisches Kollektiv",species:"Synari",color:"#e3a8bb",ideology:"communism",goal:"Industrielle Lieferketten und medizinische Versorgung",priority:"medicine",research:"industry"},vanguard:{name:"Vanguard-Kommando",species:"Menschen / Khepri",color:"#9ac9c1",ideology:"military",goal:"Flottenversorgung und gesicherte Grenzen",priority:"fuel",research:"defense"},player:{name:"Nereid-Union",species:"Menschen / Ilyri",color:"#9aaeff",ideology:"democracy"},ilyri:{goal:"Nahrungsexport und zivile Entwicklung",priority:"electronics",research:"colonies",name:"Ilyrische Liga",species:"Ilyri",color:"#89b4df",ideology:"democracy"},khepri:{goal:"Kristallexport und wissenschaftlicher Austausch",priority:"food",research:"science",name:"Khepri-Konsortium",species:"Khepri",color:"#b89be0",ideology:"technocracy"},aster:{goal:"R\xFCstungsproduktion und industrielle Unabh\xE4ngigkeit",priority:"energy",research:"industry",name:"Direktorat Aster",species:"Menschen",color:"#d99b83",ideology:"nationalSocialism"}};var yy=1/60;var Ey={friendly:[0,0,1e3],enemy:[0,0,-1e3]},vi={torpedo:{name:"Torpedobatterie",range:3600,speed:1700,damage:32,interval:2.8,lifetime:5,color:16756318},rail:{name:"Massentreiber",range:3e3,speed:6400,damage:13,interval:.9,lifetime:1.2,color:16769953},laser:{name:"Orbital-Laser",range:2600,speed:0,damage:4.2,interval:.42,lifetime:0,color:7986431},pulse:{name:"Pulsbatterie",range:2300,speed:5200,damage:1.9,interval:.34,lifetime:1.1,color:14000639}},Sn={cruiser:{name:"Schlachtkreuzer",model:"executioner",size:23,hull:260,shield:110,weapon:"torpedo",retreatSpeed:210},destroyer:{name:"Zerst\xF6rer",model:"challenger",size:16,hull:140,shield:70,weapon:"rail",retreatSpeed:260},corvette:{name:"Laserkorvette",model:"striker",size:10,hull:80,shield:45,weapon:"laser",retreatSpeed:360},interceptor:{name:"Abfangj\xE4ger",model:"spitfire",size:7,hull:42,shield:25,weapon:"pulse",retreatSpeed:440}};var ah=s=>s.combat?.weapon??s.weapon??Sn[s.type].weapon,ch=s=>s.combat?.range??vi[ah(s)].range,oh=s=>s.strategicType??s.type,lh=s=>s.combat?s.combat.power>0:!0;function xt(s){return s.hull>0&&!s.escaped}var Vf=(s,e)=>Math.hypot(s[0]-e[0],s[1]-e[1],s[2]-e[2]);function Mi(s,e){let t=[0,0,0],n=0;for(let i of s.ships)if(i.side===e&&xt(i)){for(let r=0;r<3;r++)t[r]+=i.position[r];n++}return n?t.map(i=>i/n):[...Ey[e]]}function Ha(s){return hh(s,{scope:s.scope,selected:s.selected,group:s.selectedGroup})}function hh(s,e){return e?s.ships.filter(t=>t.side==="friendly"&&xt(t)&&(e.scope==="fleet"||e.scope==="group"&&e.group&&t.group===e.group||e.scope==="ship"&&t.id===e.selected)):[]}function zf(s,e){if(!lh(e))return null;let t=ch(e),n=e.side==="friendly"&&e.order!=="retreat";if(n&&e.targeting==="target"){let o=s.ships.find(a=>a.id===e.commandTarget&&xt(a));return o&&Vf(o.position,e.position)<=t?o:null}let i,r=1/0;for(let o of s.ships){if(o.side===e.side||!xt(o)||n&&e.targeting==="class"&&oh(o)!==e.priority)continue;let a=Vf(o.position,e.position);if(a>t)continue;let l=a-(oh(o)===oh(e)?300:0);l<r&&(r=l,i=o)}return i}function Va(s,e){return s.ships.find(t=>t.id===e.target&&xt(t))}var lo=64,za=128,uh=384,Wf=200,Kf=192,Xf=96,qf=new w(0,1,0),Yf=`varying vec2 vUv;varying vec3 vTint;
void main(){vUv=uv;vTint=instanceColor;vec4 p=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);
vec2 size=vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz));p.xy+=position.xy*size;gl_Position=projectionMatrix*p;}`,Wa=class{constructor(e,t){this.scene=e,this.camera=t,this.maxBeams=za,this.maxFlashes=uh,this.maxPings=Wf,this.maxProjectiles=lo,this.beams=[],this.particles=[],this.debris=[],this.explosions=[],this.tracks=new Map,this.lastDamage=new Map,this.pings=[],this.object=new qe,this.a=new w,this.b=new w,this.direction=new w,this.color=new fe;let n=r=>new Ot({color:16777215,blending:an,transparent:!0,opacity:r,depthWrite:!1,toneMapped:!1});this.glows=this.batch(new Pn(1,1,1,6,1,!0),n(.18),za),this.cores=this.batch(new Pn(1,1,1,6,1,!0),n(.95),za),this.heads=this.batch(new ci(1,3,6),n(.95),lo),this.bolts=this.batch(new Pn(1,1,1,5,1,!0),n(.85),lo),this.wrecks=this.batch(new Di(1,1,1),new xn({color:9872305,metalness:.8,roughness:.55}),Xf),this.flashes=this.sprites(uh),this.sparks=this.sprites(Kf),this.smoke=this.sprites(48,!0),this.rings=this.batch(new Ni(1,1),new ht({transparent:!0,depthWrite:!1,blending:an,vertexShader:Yf,fragmentShader:"varying vec2 vUv;varying vec3 vTint;void main(){float r=length(vUv-.5)*2.;float a=exp(-pow((r-.72)*24.,2.))*(1.-smoothstep(.95,1.,r));gl_FragColor=vec4(vTint,a*.65);}"}),24);let i=new Je;for(let r of["position","color"])i.setAttribute(r,new Ge(new Float32Array(lo*8*6),3).setUsage(_t));i.setDrawRange(0,0),this.trails=new pn(i,new nn({vertexColors:!0,transparent:!0,opacity:.75,depthWrite:!1,blending:an,toneMapped:!1})),this.trails.frustumCulled=!1,e.add(this.trails),this.lights=Array.from({length:3},()=>{let r=new os(16777215,0,55,2);return e.add(r),{light:r,until:-1,power:0}})}ensureCapacity(e){this.maxBeams=Math.max(za,e*2),this.maxFlashes=Math.max(uh,e*4),this.maxPings=Math.max(Wf,e*2),this.maxProjectiles=Math.max(lo,e*4);for(let[t,n]of[["glows",this.maxBeams],["cores",this.maxBeams],["flashes",this.maxFlashes],["heads",this.maxProjectiles],["bolts",this.maxProjectiles]]){let i=this[t];if(i.instanceMatrix.count>=n)continue;let r=this.batch(i.geometry,i.material,n);i.removeFromParent(),i.dispose(),this[t]=r}if(this.trails.geometry.attributes.position.count<this.maxProjectiles*16)for(let t of["position","color"])this.trails.geometry.setAttribute(t,new Ge(new Float32Array(this.maxProjectiles*8*6),3).setUsage(_t))}batch(e,t,n){let i=new Zt(e,t,n);return i.count=0,i.frustumCulled=!1,i.instanceMatrix.setUsage(_t),i.setColorAt(0,this.color.set(16777215)),this.scene.add(i),i}sprites(e,t=!1){return this.batch(new Ni(1,1),new ht({transparent:!0,depthWrite:!1,blending:t?oi:an,vertexShader:Yf,fragmentShader:`varying vec2 vUv;varying vec3 vTint;void main(){float r=length(vUv-.5)*2.;float a=exp(-r*r*${t?"3.":"7."})*(1.-smoothstep(.75,1.,r));gl_FragColor=vec4(vTint,a*${t?".35":".8"});}`}),e)}sprite(e,t,n,i,r,o=1){this.object.position.fromArray(n),this.object.quaternion.identity(),this.object.scale.setScalar(i*2),this.object.updateMatrix(),e.setMatrixAt(t,this.object.matrix),e.setColorAt(t,this.color.set(r).multiplyScalar(o))}line(e,t,n,i,r=1){let o=this.trails.geometry.attributes.position.array,a=this.trails.geometry.attributes.color.array;this.color.set(i).multiplyScalar(r);for(let l=0;l<3;l++)o[e*6+l]=t[l],o[e*6+l+3]=n[l],a[e*6+l]=a[e*6+l+3]=[this.color.r,this.color.g,this.color.b][l]}cylinder(e,t,n,i,r,o,a=1){this.a.fromArray(n),this.b.fromArray(i),this.direction.subVectors(this.b,this.a),this.object.position.copy(this.a).add(this.b).multiplyScalar(.5),this.object.quaternion.setFromUnitVectors(qf,this.direction.normalize()),this.object.scale.set(r,this.a.distanceTo(this.b),r),this.object.updateMatrix(),e.setMatrixAt(t,this.object.matrix),e.setColorAt(t,this.color.set(o).multiplyScalar(a))}flash(e,t,n,i=1,r=!1){for(let o=0;o<(r?1:7);o++)this.particles.length===Kf&&this.particles.shift(),this.particles.push({position:[...e],velocity:[Math.sin(o*2.4),Math.cos(o*1.8),Math.sin(o*3.7)].map(a=>a*(r?2:9)*i),color:o?t:16772817,time:n,duration:r?1.8:.48,size:r?i:.3*i,smoke:r})}light(e,t,n,i){if(this.camera.position.distanceTo(this.a.fromArray(e))>300)return;let r=this.lights.find(o=>n>=o.until)??this.lights[0];r.light.position.fromArray(e),r.light.color.set(t),r.until=n+.18,r.power=i}impact(e,t){let n=t.get(e.target);return n?(this.a.fromArray(e.from??e.position).sub(n.group.position).normalize(),this.b.copy(this.a).applyQuaternion(n.group.quaternion.clone().invert()),n.hit.copy(this.b),n.hitAge=0,n.pulse=e.shield?1:n.pulse,this.b.multiply(n.shield.scale).multiplyScalar(e.shield?1:.72).applyQuaternion(n.group.quaternion).add(n.group.position),this.b.toArray()):e.position}destroy(e,t,n){let i=n.get(e.ship);i&&(i.death=t);let r=i?Math.max(i.size.x,i.size.y,i.size.z):15;this.explosions.push({position:[...e.position],size:r,time:t});for(let o=0;o<18;o++)this.debris.length===Xf&&this.debris.shift(),this.debris.push({position:e.position.map((a,l)=>a+Math.sin(o*(l+3))*r*.22),velocity:[Math.sin(o*4.7),Math.cos(o*2.6),Math.sin(o*1.9)].map(a=>a*r*.6),size:r*(.025+o%5*.013),time:t,spin:o*2.2});this.flash(e.position,16750137,t,r*.15),this.light(e.position,16751941,t,850)}update(e,t,n,i){let r=0,o=0;for(let u of n)if(u.kind==="fire"){let p=i.get(u.ship),g=p?.guns[Math.floor(u.day*60)%2]??p?.guns[0],m=p?.fixedWeapons?u.from:g?g.localToWorld(this.a.set(0,.2,-1.65)).toArray():u.from;p&&(p.recoil=1,p.muzzleTime=t,p.muzzle=[...m]),u.weapon==="laser"&&(this.beams.length===this.maxBeams&&this.beams.shift(),this.beams.push({from:[...m],to:u.to,time:t})),this.flash(m,vi[u.weapon].color,t,u.weapon==="torpedo"?.7:.35),this.light(m,vi[u.weapon].color,t,u.weapon==="torpedo"?240:120),this.overview&&this.pings.push({position:[...m],time:t,color:vi[u.weapon].color,impact:!1})}else if(u.kind==="impact"){let p=this.impact(u,i),g=u.weapon==="torpedo"?2:.7;this.flash(p,u.shield?9423615:16755811,t,g),this.light(p,u.shield?7129855:16751440,t,180*g),this.overview&&this.pings.push({position:[...p],time:t,color:u.shield?9423615:16755811,impact:!0})}else u.kind==="destroy"&&this.destroy(u,t,i);this.beams=this.beams.filter(u=>t-u.time<.23);for(let u=0;u<this.beams.length;u++){let p=this.beams[u],g=1-(t-p.time)/.23,m=this.overview?this.camera.position.distanceTo(this.a.fromArray(p.from))*2*Math.tan(qn.degToRad(this.camera.fov/2))/(this.camera.userData.viewportHeight||844):0;this.cylinder(this.cores,u,p.from,p.to,Math.max(.11,m*.3),vi.laser.color,g*4),this.cylinder(this.glows,u,p.from,p.to,Math.max(.6,m),vi.laser.color,g*1.3)}this.cores.count=this.glows.count=this.beams.length;let a=0,l=0,c=0,h=new Set;for(let u of e.projectiles.slice(0,this.maxProjectiles)){let{position:p,velocity:g,weapon:m}=u,A=vi[m].color;h.add(u.id),this.a.fromArray(p);let x=Math.max(m==="torpedo"?.48:.2,this.camera.position.distanceTo(this.a)*45e-5);if(this.object.position.copy(this.a),this.object.quaternion.setFromUnitVectors(qf,this.direction.fromArray(g).normalize()),this.object.scale.set(x,x*(m==="torpedo"?1.7:1),x),this.object.updateMatrix(),this.heads.setMatrixAt(a,this.object.matrix),this.heads.setColorAt(a++,this.color.set(A).multiplyScalar(2.5)),r<this.maxFlashes&&this.sprite(this.flashes,r++,p,x*3,A,2),m==="torpedo"){let v=this.tracks.get(u.id);v||(v={points:[],age:-1},this.tracks.set(u.id,v)),v.age!==u.age&&(v.points.push([...p]),v.points.length>8&&v.points.shift(),v.age=u.age);for(let y=1;y<v.points.length;y++)this.line(c++,v.points[y-1],v.points[y],A,y/v.points.length*1.2)}else{this.direction.fromArray(g).normalize().multiplyScalar(m==="rail"?65:18);let v=this.b.copy(this.a).sub(this.direction).toArray();this.line(c++,v,p,A,1.5),this.cylinder(this.bolts,l++,v,p,x*.4,A,3)}}for(let u of this.tracks.keys())h.has(u)||this.tracks.delete(u);this.heads.count=a,this.bolts.count=l,this.trails.geometry.setDrawRange(0,c*2),this.explosions=this.explosions.filter(u=>t-u.time<3.2);for(let u of this.explosions){let p=t-u.time;r<this.maxFlashes&&this.sprite(this.flashes,r++,u.position,u.size*(.12+p*.32),16750399,Math.max(0,2.5-p)),o<24&&this.sprite(this.rings,o++,u.position,u.size*(.15+p*.9),16760690,Math.max(0,1-p/2))}if(this.pings=this.pings.filter(u=>t-u.time<.32).slice(-this.maxPings),this.overview)for(let u of this.pings){if(r>=this.maxFlashes)break;let p=(t-u.time)/.32,g=this.camera.position.distanceTo(this.a.fromArray(u.position))*2*Math.tan(qn.degToRad(this.camera.fov/2))/(this.camera.userData.viewportHeight||844);this.sprite(this.flashes,r++,u.position,g*(u.impact?3.2:1.9)*(1+p*.4),u.color,(1-p)*(u.impact?1.6:1.1))}for(let u of e.ships){let p=i.get(u.id);if(!p||!xt(u))continue;t-(p.muzzleTime??-10)<.18&&r<this.maxFlashes&&this.sprite(this.flashes,r++,p.muzzle,1.8,vi[ah(u)].color,4);let g=u.hull/Sn[u.type].hull;if(g<.65&&t-(this.lastDamage.get(u.id)??-10)>.25){this.lastDamage.set(u.id,t);let m=p.group.localToWorld(this.a.set(p.size.x*.16,p.size.y*.28,p.size.z*.12)).toArray();this.flash(m,16738347,t,1.2*(1-g)),this.flash(m,2699584,t,1.8,!0)}}this.flashes.count=r,this.rings.count=o,this.particles=this.particles.filter(u=>t-u.time<u.duration);let d=0,f=0;for(let u of this.particles){let p=t-u.time,g=Math.max(0,1-p/u.duration),m=u.position.map((A,x)=>A+u.velocity[x]*p);u.smoke?f<48&&this.sprite(this.smoke,f++,m,u.size*(1+p),u.color,g):this.sprite(this.sparks,d++,m,u.size*(1+p*2),u.color,g*3)}this.sparks.count=d,this.smoke.count=f,this.debris=this.debris.filter(u=>t-u.time<10);for(let u=0;u<this.debris.length;u++){let p=this.debris[u],g=t-p.time,m=Math.min(1,(10-g)/2);this.object.position.fromArray(p.position.map((A,x)=>A+p.velocity[x]*g)),this.object.rotation.set(p.spin+g*.7,p.spin*.2+g,g*.4),this.object.scale.set(p.size*m,p.size*.32*m,p.size*.7*m),this.object.updateMatrix(),this.wrecks.setMatrixAt(u,this.object.matrix),this.wrecks.setColorAt(u,this.color.set(u%4?7109003:12482367))}this.wrecks.count=this.debris.length;for(let u of this.lights)u.light.intensity=Math.max(0,(u.until-t)/.18)*u.power;for(let u of[this.heads,this.bolts,this.glows,this.cores,this.flashes,this.rings,this.sparks,this.smoke,this.wrecks])u.instanceMatrix.needsUpdate=!0,u.instanceColor&&(u.instanceColor.needsUpdate=!0),u.visible=u.count>0;for(let u of Object.values(this.trails.geometry.attributes))u.needsUpdate=!0;this.trails.visible=c>0,this.animating=this.beams.length>0||this.particles.length>0||this.debris.length>0||this.explosions.length>0}};var dh={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var xy=new fi(-1,1,1,-1,0,1),fh=class extends Je{constructor(){super(),this.setAttribute("position",new Ze([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ze([0,2,0,0,2,0],2))}},vy=new fh,Ka=class{constructor(e){this._mesh=new At(vy,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,xy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Jf="varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",Xa=class{constructor(e){this.renderer=e;let t=e.extensions.has("EXT_color_buffer_float");this.sceneTarget=new fn(1,1,{type:t?Xt:Ue,samples:2}),this.glowA=new fn(1,1,{depthBuffer:!1}),this.glowB=this.glowA.clone(),this.extract=new ht({depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:{image:{value:null},texel:{value:new Se},threshold:{value:t?1.25:.75}},vertexShader:Jf,fragmentShader:`varying vec2 vUv;uniform sampler2D image;uniform vec2 texel;uniform float threshold;
      vec3 bright(vec2 uv){vec3 c=texture2D(image,uv).rgb;float l=max(c.r,max(c.g,c.b));return c*max(0.,l-threshold)/max(l,.001);}
      void main(){vec3 c=bright(vUv)*.4;c+=bright(vUv+texel)*.15;c+=bright(vUv-texel)*.15;c+=bright(vUv+vec2(texel.x,-texel.y))*.15;c+=bright(vUv+vec2(-texel.x,texel.y))*.15;gl_FragColor=vec4(c,1.);}`}),this.blur=new ht({depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:{image:{value:null},direction:{value:new Se}},vertexShader:Jf,fragmentShader:`varying vec2 vUv;uniform sampler2D image;uniform vec2 direction;
      void main(){vec3 c=texture2D(image,vUv).rgb*.227027;c+=(texture2D(image,vUv+direction*1.384615).rgb+texture2D(image,vUv-direction*1.384615).rgb)*.316216;c+=(texture2D(image,vUv+direction*3.230769).rgb+texture2D(image,vUv-direction*3.230769).rgb)*.070270;gl_FragColor=vec4(c,1.);}`}),this.output=new Yr({depthTest:!1,depthWrite:!1,defines:{ACES_FILMIC_TONE_MAPPING:"",SRGB_TRANSFER:""},uniforms:{tDiffuse:{value:null},glow:{value:null},toneMappingExposure:{value:1}},vertexShader:dh.vertexShader,fragmentShader:dh.fragmentShader.replace("uniform sampler2D tDiffuse;","uniform sampler2D tDiffuse;uniform sampler2D glow;").replace("gl_FragColor = texture2D( tDiffuse, vUv );",`gl_FragColor=texture2D(tDiffuse,vUv);gl_FragColor.rgb+=texture2D(glow,vUv).rgb*.65;
          vec2 edge=vUv-.5;gl_FragColor.rgb*=1.-smoothstep(.18,.68,length(edge))*.16;`)}),this.quad=new Ka(this.extract)}resize(e,t,n){let i=Math.max(1,Math.round(e*n)),r=Math.max(1,Math.round(t*n));this.sceneTarget.setSize(i,r),this.glowWidth=Math.max(1,Math.min(512,Math.round(i/3))),this.glowHeight=Math.max(1,Math.min(768,Math.round(r/3))),this.glowA.setSize(this.glowWidth,this.glowHeight),this.glowB.setSize(this.glowWidth,this.glowHeight),this.extract.uniforms.texel.value.set(1/i,1/r)}pass(e,t){this.quad.material=e,this.renderer.setRenderTarget(t),this.quad.render(this.renderer)}render(e,t){let n=this.renderer;n.info.reset(),n.info.autoReset=!1,n.setRenderTarget(this.sceneTarget),n.render(e,t),this.extract.uniforms.image.value=this.sceneTarget.texture,this.pass(this.extract,this.glowA),this.blur.uniforms.image.value=this.glowA.texture,this.blur.uniforms.direction.value.set(1/this.glowWidth,0),this.pass(this.blur,this.glowB),this.blur.uniforms.image.value=this.glowB.texture,this.blur.uniforms.direction.value.set(0,1/this.glowHeight),this.pass(this.blur,this.glowA),this.output.uniforms.tDiffuse.value=this.sceneTarget.texture,this.output.uniforms.glow.value=this.glowA.texture,this.output.uniforms.toneMappingExposure.value=n.toneMappingExposure,this.pass(this.output,null)}dispose(){for(let e of[this.sceneTarget,this.glowA,this.glowB])e.dispose();for(let e of[this.extract,this.blur,this.output])e.dispose();this.quad.dispose()}};function Zf(s){let e=document.createElement("canvas");e.width=512,e.height=256;let t=e.getContext("2d"),n=t.createLinearGradient(0,0,0,256);for(let[l,c]of[[0,"#b2c6e8"],[.25,"#455a81"],[.52,"#0b1326"],[.73,"#172c4c"],[1,"#0b1427"]])n.addColorStop(l,c);t.fillStyle=n,t.fillRect(0,0,512,256);let i=t.createRadialGradient(120,72,0,120,72,48);i.addColorStop(0,"#fff0d1"),i.addColorStop(.25,"#e6d0a188"),i.addColorStop(1,"#aabce600"),t.fillStyle=i,t.fillRect(0,0,512,256);let r=new Ui(e);r.mapping=$s,r.colorSpace=nt;let o=new _r(s),a=o.fromEquirectangular(r);return o.dispose(),r.dispose(),a}function jf(){let e=new Uint8Array(65536);for(let n=0;n<128;n++)for(let i=0;i<128;i++){let r=i%32,o=n%64,a=(n*128+i)*4;e[a]=r===0?78:r===1?176:128,e[a+1]=o===0?76:o===1?178:128,e[a+2]=250,e[a+3]=255}let t=new ai(e,128,128);return t.wrapS=t.wrapT=On,t.repeat.set(2,2),t.magFilter=Et,t.minFilter=Kt,t.generateMipmaps=!0,t.needsUpdate=!0,t}var qa=class{constructor(e=1){this.maximum=Math.min(1.75,Math.max(1,e)),this.ratio=Math.min(1.5,this.maximum),this.slow=0,this.fast=0}observe(e,t=!0){if(!t||!Number.isFinite(e)||e<=0||e>.25)return this.slow=this.fast=0,!1;this.slow=e>.026?this.slow+e:Math.max(0,this.slow-e*2),this.fast=e<.019?this.fast+e:0;let n=this.ratio;return this.slow>2?(this.ratio=Math.max(.85,this.ratio-.15),this.slow=this.fast=0):this.fast>8&&(this.ratio=Math.min(this.maximum,this.ratio+.1),this.slow=this.fast=0),this.ratio!==n}};var $f={friendly:7454719,enemy:16745625},ph=new w(0,0,-1),Ya=class{constructor(e,{onSelect:t,onUnavailable:n,onProgress:i}={}){this.canvas=e,this.onSelect=t,this.onUnavailable=n,this.onProgress=i,this.models=new Map,this.ships=new Map,this.disposed=!1,this.mode="ship",this.dirty=!0,this.loadingManager=new Js,this.a=new w,this.b=new w,this.quaternion=new bt,this.color=new fe,this.followed=new w,this.raycaster=new Zs,this.renderer=new La({canvas:e,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.quality=new qa(devicePixelRatio||1),this.pixelRatio=this.quality.ratio,this.renderer.setPixelRatio(this.pixelRatio),this.renderer.outputColorSpace=nt,this.renderer.toneMapping=la,this.renderer.toneMappingExposure=1.15,this.presentation=new Xa(this.renderer),this.environmentTarget=Zf(this.renderer),this.panelMap=jf(),this.scene=new Gr,this.scene.background=new fe(329747),this.scene.environment=this.environmentTarget.texture,this.scene.environmentIntensity=.55,this.camera=new Ct(42,1,1,35e3),this.camera.position.set(65,65,1610),this.controls=new ka(this.camera,e),this.controls.enableDamping=!0,this.controls.dampingFactor=.12,this.controls.minDistance=18,this.controls.maxDistance=12e3,this.controls.rotateSpeed=.55,this.controls.zoomSpeed=.75,this.controls.maxPolarAngle=Math.PI*.88,this.controls.target.set(0,0,1e3),this.followed.copy(this.controls.target),this.controls.touches.ONE=An.ROTATE,this.controls.touches.TWO=An.DOLLY_PAN,this.controls.addEventListener("change",()=>{this.dirty=!0}),this.controls.addEventListener("start",()=>{this.transition=null}),this.controls.update(),this.scene.add(new eo(12178687,659484,.65));let r=new Oi(16772557,3.1);r.position.set(-400,750,900),this.scene.add(r);let o=new Oi(8501247,2.2);o.position.set(400,200,-900),this.scene.add(o),this.makeSpace(),this.makePlanet(),this.makeAttachments(),this.effects=this.makeEffects(),this.bindInput(),this.contextLost=a=>{a.preventDefault(),this.disposed||this.onUnavailable?.("Die 3D-Ansicht wurde vom Browser unterbrochen. Du kannst die Probeschlacht erneut starten.")},e.addEventListener("webglcontextlost",this.contextLost)}bindInput(){this.pointerStart=e=>{this.pointer?this.pointer.multiple=!0:this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY,moved:!1,multiple:!1}},this.pointerMove=e=>{this.pointer&&Math.hypot(e.clientX-this.pointer.x,e.clientY-this.pointer.y)>7&&(this.pointer.moved=!0)},this.pointerEnd=e=>{let t=this.pointer;if(!t||t.id!==e.pointerId||(this.pointer=null,t.moved||t.multiple||this.disposed))return;let n=this.pickContact?.(e.clientX,e.clientY);if(n!==void 0){n&&this.onSelect?.(n);return}let i=this.canvas.getBoundingClientRect(),r=new Se((e.clientX-i.left)/i.width*2-1,-(e.clientY-i.top)/i.height*2+1);this.raycaster.setFromCamera(r,this.camera);let o=[...this.ships.values()].filter(l=>l.group.visible).map(l=>l.body),a=this.raycaster.intersectObjects(o,!0)[0];a&&this.onSelect?.(a.object.userData.shipId)},this.pointerCancel=()=>{this.pointer=null};for(let[e,t]of[["pointerdown",this.pointerStart],["pointermove",this.pointerMove],["pointerup",this.pointerEnd],["pointercancel",this.pointerCancel]])this.canvas.addEventListener(e,t)}makeSpace(){let e=3077,t=()=>(e=e*1664525+1013904223>>>0,e/4294967296),n=[],i=[];for(let c=0;c<1e3;c++){let h=this.a.set(t()-.5,t()-.5,t()-.5).normalize().multiplyScalar(14e3+t()*8e3);n.push(h.x,h.y,h.z);let d=.35+t()*.65;i.push(d*.8,d*.88,d)}let r=new Je;r.setAttribute("position",new Ze(n,3)),r.setAttribute("color",new Ze(i,3)),this.scene.add(new En(r,new Li({size:1,vertexColors:!0,sizeAttenuation:!1,transparent:!0,opacity:.85,depthWrite:!1})));let o=document.createElement("canvas");o.width=1024,o.height=512;let a=o.getContext("2d");a.fillStyle="#030610",a.fillRect(0,0,1024,512);for(let[c,h,d,f]of[[220,240,320,"#16395685"],[760,180,240,"#40395d50"],[370,305,150,"#5b728f32"]]){let u=a.createRadialGradient(c,h,0,c,h,d);u.addColorStop(0,f),u.addColorStop(1,"#05081300"),a.fillStyle=u,a.fillRect(0,0,1024,512)}for(let c=0;c<32;c++){let h=160+t()*430,d=230+Math.sin(c*.22)*50,f=35+t()*75,u=a.createRadialGradient(h,d,0,h,d,f);u.addColorStop(0,"#00030b36"),u.addColorStop(1,"#00030b00"),a.fillStyle=u,a.fillRect(h-f,d-f,f*2,f*2)}let l=new Ui(o);l.colorSpace=nt,this.scene.add(new At(new li(27e3,24,16),new Ot({map:l,side:Pt,depthWrite:!1,toneMapped:!1})))}makePlanet(){let e=document.createElement("canvas");e.width=512,e.height=256;let t=e.getContext("2d"),n=t.createImageData(512,256),i=(c,h,d)=>{let f=Math.sin(c*127.1+h*311.7+d*74.7)*43758.5453;return f-Math.floor(f)},r=(c,h,d)=>{let f=Math.floor(c),u=Math.floor(h),p=Math.floor(d),g=c-f,m=h-u,A=d-p;g=g*g*(3-2*g),m=m*m*(3-2*m),A=A*A*(3-2*A);let x=(v,y,I)=>v+(y-v)*I;return x(x(x(i(f,u,p),i(f+1,u,p),g),x(i(f,u+1,p),i(f+1,u+1,p),g),m),x(x(i(f,u,p+1),i(f+1,u,p+1),g),x(i(f,u+1,p+1),i(f+1,u+1,p+1),g),m),A)};for(let c=0;c<256;c++)for(let h=0;h<512;h++){let d=c/255*Math.PI,f=h/511*Math.PI*2,u=Math.sin(d)*Math.cos(f),p=Math.cos(d),g=Math.sin(d)*Math.sin(f),m=r(u*4,p*4,g*4)*.65+r(u*11+3,p*11,g*11)*.25+r(u*27,p*27,g*27)*.1,A=Math.max(0,Math.min(1,(m-.47)*15)),x=Math.max(0,(r(u*12+18,p*12+3,g*12)-.57)*2.1),v=Math.max(0,Math.min(1,(Math.abs(p)-.88+m*.05)*12)),y=[9,35,60],I=[35+m*28,51+m*32,48+m*25];for(let T=0;T<3;T++){let R=y[T]+(I[T]-y[T])*A;R+=([167,193,204][T]-R)*v,R+=(185-R)*x,n.data[(c*512+h)*4+T]=R}n.data[(c*512+h)*4+3]=255}t.putImageData(n,0,0);let o=new Ui(e);o.colorSpace=nt;let a=new At(new li(1250,64,40),new xn({map:o,color:6321547,metalness:.05,roughness:.9,envMapIntensity:.04}));a.position.set(-2700,-1450,-4400),a.rotation.z=-.3,this.scene.add(a);let l=new At(new li(1275,48,28),new ht({transparent:!0,depthWrite:!1,blending:an,side:Pt,vertexShader:"varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying vec3 vNormal;void main(){float rim=pow(1.-abs(vNormal.z),3.);gl_FragColor=vec4(.18,.48,1.,rim*.42);}"}));l.position.copy(a.position),this.scene.add(l)}makeAttachments(){let e=new Pn(.45,.6,.45,8),t=new Pn(.12,.17,1.55,6);t.rotateX(Math.PI/2),t.translate(0,0,-.8);let n=Td([e,t]);e.dispose(),t.dispose(),this.gunBatch=new Zt(n,new xn({color:5794689,metalness:.85,roughness:.3,envMapIntensity:1.1}),16),this.coreBatch=new Zt(new li(.23,8,6),new Ot({color:new fe(13233151).multiplyScalar(4),toneMapped:!1}),16);let i=new ci(.34,2.9,8,1,!0),r=i.attributes.uv,o=new Float32Array(r.count*3);for(let a=0;a<r.count;a++){let l=(1-r.getY(a))**2;o.set([l,l,l],a*3)}i.setAttribute("color",new Ge(o,3)),i.rotateX(Math.PI/2),i.translate(0,0,1.5),this.plumeBatch=new Zt(i,new Ot({vertexColors:!0,transparent:!0,opacity:.65,blending:an,depthWrite:!1,toneMapped:!1}),16);for(let a of[this.gunBatch,this.coreBatch,this.plumeBatch])a.count=0,a.frustumCulled=!1,a.instanceMatrix.setUsage(_t),this.scene.add(a)}async load(e){let t=new vr(this.loadingManager),n=[...new Set(Object.values(Sn).map(r=>r.model))],i=0;for(let r=0;r<n.length;r+=2){let a=(await Promise.allSettled(n.slice(r,r+2).map(async l=>{let c=await t.loadAsync(new URL(`../models/quaternius/${l}.glb`,import.meta.url).href);if(this.disposed){this.releaseObjects([c.scene]);return}this.models.set(l,c.scene),this.onProgress?.(++i,n.length)}))).find(l=>l.status==="rejected");if(a)throw a.reason;if(this.disposed)return}for(let r of e.ships)this.makeShip(r);this.resize(),this.setMode("ship",e,!1),await this.renderer.compileAsync(this.scene,this.camera)}makeShip(e){let t=Sn[e.type],n=$f[e.side],i=this.models.get(this.modelName(e)).clone(!0),r=new Wt().setFromObject(i),o=r.getSize(new w),a=r.getCenter(new w),l=(e.length??t.size)/Math.max(o.x,o.y,o.z);o.multiplyScalar(l),i.position.copy(a).multiplyScalar(-l),i.scale.setScalar(l);let c=new zt;c.add(i),this.orientBody(c,e),c.updateWorldMatrix(!0,!0),new Wt().setFromObject(c).getSize(o),i.traverse(m=>{m.isMesh&&(m.userData.shipId=e.id,this.prepareMaterial(m,e))});let h=new zt;h.add(c),h.updateWorldMatrix(!0,!0);let d=new Zs,f=(m,A)=>(d.set(m,A),d.intersectObject(c,!0)[0]?.point),u=[],p=[];for(let m of[-1,1]){let A;for(let x of[.27,.36,.15])if(A=f(this.a.set(m*o.x*x,-o.y*.12,o.z),ph),A)break;if(A){let x=new qe;x.position.copy(A),x.position.z+=.15;let v=new qe;x.add(v),h.add(x),u.push({engine:x,plume:v})}A=null;for(let x of[.14,.26,.36,.04])if(A=f(this.a.set(m*o.x*x,o.y+2,-o.z*.05),this.b.set(0,-1,0)),A)break;if(A){let x=new qe;x.position.copy(A),x.position.y+=.2,x.userData.baseZ=x.position.z,h.add(x),p.push(x)}}let g=new At(new li(1,16,10),new ht({uniforms:{color:{value:new fe(n).multiplyScalar(2)},strength:{value:0},hit:{value:new w(0,0,-1)},age:{value:0}},transparent:!0,depthWrite:!1,blending:an,vertexShader:"varying vec3 vNormal;varying vec3 vView;varying vec3 vLocal;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vLocal=normalize(position);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}",fragmentShader:`uniform vec3 color;uniform float strength;uniform vec3 hit;uniform float age;varying vec3 vNormal;varying vec3 vView;varying vec3 vLocal;
      void main(){float d=acos(clamp(dot(normalize(vLocal),normalize(hit)),-1.,1.));float wave=exp(-pow((d-age*4.)*11.,2.));float spot=exp(-d*d*7.)*exp(-age*3.);float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),3.);
      gl_FragColor=vec4(color,(wave*.48+spot*.6+rim*.08)*strength);}`}));g.scale.set(o.x*.6+.6,o.y*.65+1.1,o.z*.6+.6),g.visible=!1,h.add(g),h.position.fromArray(e.position),e.side==="enemy"&&(h.rotation.y=Math.PI),this.scene.add(h),this.ships.set(e.id,{group:h,body:c,engines:u,guns:p,shield:g,size:o,pulse:0,hit:new w(0,0,-1),hitAge:2,death:null,recoil:0})}modelName(e){return Sn[e.type].model}orientBody(e){e.rotation.y=Math.PI}makeEffects(){return new Wa(this.scene,this.camera)}beforeRender(){}visibleShip(e,t,n){return t||n<4}prepareMaterial(e,t){e.material=e.material.clone(),e.material.color.multiply(new fe(t.side==="friendly"?11453656:13612473)),e.material.metalness=.55,e.material.roughness=.46,e.material.envMapIntensity=.85,e.material.normalMap=this.panelMap,e.material.normalScale.set(.22,.22),e.material.emissive.set(660516),e.material.emissiveIntensity=.12,e.userData.baseColor=e.material.color.clone(),e.material.map&&(e.material.map.anisotropy=Math.min(4,this.renderer.capabilities.getMaxAnisotropy()))}updateMaterial(e,t,n){e.material.color.copy(e.userData.baseColor).multiplyScalar(n?.6+.4*t:.22),e.material.emissive.set(t<.5?4527114:660516),e.material.emissiveIntensity=t<.5?.35:.12}resize(){if(this.disposed)return;let e=Math.max(1,this.canvas.clientWidth),t=Math.max(1,this.canvas.clientHeight);this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.presentation.resize(e,t,this.pixelRatio);let n=document.querySelector(".battle-toolbar")?.getBoundingClientRect().bottom??0,i=document.querySelector(".target-hud")?.getBoundingClientRect().bottom??0;this.viewportTop=Math.max(n+18,i+10),this.viewportBottom=document.querySelector(".battle-bottom")?.getBoundingClientRect().top??t,this.camera.setViewOffset(e,t,0,t/2-(this.viewportTop+this.viewportBottom)/2,e,t),this.camera.updateProjectionMatrix(),this.dirty=!0}setMode(e,t,n=!0){let i=this.camera.position.clone(),r=this.controls.target.clone();this.mode=e;let o=e==="target"?t.target:t.selected,a=this.ships.get(o),l=e==="target";this.focusId=o;let c=Math.min(1,Math.max(.25,(this.viewportBottom-this.viewportTop)/260));if((e==="ship"||e==="target")&&a){this.controls.target.copy(a.group.position);let h=l?-1:1;this.camera.position.copy(a.group.position).add(this.a.set(h*2.65,1.45*c,h*3.65).multiplyScalar(Sn[t.ships.find(d=>d.id===o).type].size))}else if(e==="overview"){let h=this.a.fromArray(Mi(t,"friendly")),d=this.b.fromArray(Mi(t,"enemy")),f=h.distanceTo(d);this.controls.target.copy(h).add(d).multiplyScalar(.5);let u=Math.max(.15,(this.viewportBottom-this.viewportTop)/this.canvas.clientHeight),p=f*.57/Math.tan(qn.degToRad(this.camera.fov/2))/u;this.camera.position.copy(this.controls.target).add(this.a.set(.16,.84,.52).normalize().multiplyScalar(p))}else this.controls.target.fromArray(Mi(t,l?"enemy":"friendly")),this.camera.position.copy(this.controls.target).add(this.a.set(l?-60:60,65*c,l?-295:295));this.followed.copy(this.controls.target),n&&!matchMedia("(prefers-reduced-motion: reduce)").matches?(this.transition={position:i,target:r,endPosition:this.camera.position.clone(),endTarget:this.controls.target.clone(),elapsed:0},this.camera.position.copy(i),this.controls.target.copy(r)):this.transition=null,this.controls.update(),this.dirty=!0}updateAttachments(e,t){let n=0,i=0;for(let r of e.ships){let o=this.ships.get(r.id);if(!(!o?.group.visible||!xt(r))){if(!o.authoredGuns)for(let a of o.guns)this.gunBatch.setMatrixAt(n++,a.matrixWorld);for(let{engine:a,plume:l}of o.engines)this.coreBatch.setMatrixAt(i,a.matrixWorld),l.scale.z=(r.order==="retreat"?1.8:.65)*(1+Math.sin(t*19+r.position[0])*.08),l.updateWorldMatrix(!0,!1),this.plumeBatch.setMatrixAt(i,l.matrixWorld),this.plumeBatch.setColorAt(i++,this.color.set(o.engineColor??$f[r.side]).multiplyScalar(2))}}this.gunBatch.count=n,this.coreBatch.count=this.plumeBatch.count=i;for(let r of[this.gunBatch,this.coreBatch,this.plumeBatch])r.instanceMatrix.needsUpdate=!0;this.plumeBatch.instanceColor&&(this.plumeBatch.instanceColor.needsUpdate=!0)}render(e,t,n=[],i=0){if(this.disposed)return;let r=Math.min(.1,Math.max(0,i)),o=performance.now(),a=Math.min(.06,Math.max(0,(o-(this.lastCameraFrame??o))/1e3));this.lastCameraFrame=o;for(let c of n)if(c.kind==="destroy"){let h=this.ships.get(c.ship);h&&(h.death=t)}for(let c of e.ships){let h=this.ships.get(c.id);if(!h)continue;let d=xt(c),f=h.death===null?100:t-h.death;h.living=d,h.group.visible=this.visibleShip(c,d,f),h.group.position.fromArray(c.position),d?h.body.rotation.z=Math.sin(t*.32+c.position[0])*.012:(h.body.rotation.z=f*.2,h.body.rotation.x=f*.08,h.body.scale.setScalar(Math.max(.15,1-Math.max(0,f-2)*.4)));let u=c.hull/Sn[c.type].hull;h.body.traverse(g=>{g.isMesh&&this.updateMaterial(g,u,d)});let p=Va(e,c);if(this.a.copy(c.facing?this.b.fromArray(c.facing):c.order==="retreat"?this.b.set(0,0,1):p?this.b.fromArray(p.position).sub(h.group.position).normalize():c.side==="friendly"?ph:this.b.set(0,0,1)),this.quaternion.setFromUnitVectors(ph,this.a),c.facing?h.group.quaternion.copy(this.quaternion):h.group.quaternion.slerp(this.quaternion,r?1-Math.exp(-5*r):0),p&&!h.fixedWeapons){h.group.updateWorldMatrix(!0,!1);let g=h.group.worldToLocal(this.a.fromArray(p.position));for(let m of h.guns)m.rotation.y=Math.atan2(-g.x,-g.z)}h.pulse=Math.max(0,h.pulse-r*3),h.hitAge+=r,h.recoil=Math.max(0,h.recoil-r*7);for(let g of h.guns)g.position.z=g.userData.baseZ+h.recoil*.22;h.group.updateWorldMatrix(!0,!0)}this.effects.update(e,t,n,this.ships);for(let c of this.ships.values())c.shield.visible=c.pulse>.01&&c.group.visible&&c.living,c.shield.material.uniforms.strength.value=c.pulse,c.shield.material.uniforms.age.value=c.hitAge,c.shield.material.uniforms.hit.value.copy(c.hit);let l=this.inspectionId??(this.mode==="target"?e.target:e.selected);if((this.mode==="ship"||this.mode==="target")&&l!==this.focusId&&this.setMode(this.mode,e),this.transition){let c=this.transition;c.elapsed+=a;let h=Math.min(1,c.elapsed/.65),d=h*h*(3-2*h);this.camera.position.lerpVectors(c.position,c.endPosition,d),this.controls.target.lerpVectors(c.target,c.endTarget,d),h===1&&(this.transition=null)}else(this.mode!=="overview"||this.overviewFollowsFleet)&&(this.mode==="ship"||this.mode==="target"?this.a.copy(this.ships.get(l)?.group.position??this.controls.target):this.a.fromArray(Mi(e,"friendly")),this.b.subVectors(this.a,this.followed),this.camera.position.add(this.b),this.controls.target.add(this.b),this.followed.copy(this.a));this.updateAttachments(e,t),this.animating=this.effects.animating||!!this.transition||[...this.ships.values()].some(c=>c.pulse>.01||c.death!==null&&t-c.death<4),this.dirty=!1,this.controls.update(),this.beforeRender(e,t),this.presentation.render(this.scene,this.camera)}labelPosition(e,t){if(e.startsWith("fleet:"))this.a.fromArray(Mi(t,e.split(":")[1]));else{let c=this.ships.get(e);if(!c?.group.visible)return null;this.a.copy(c.group.position),this.a.y+=c.size.y*.55+1.5}this.a.project(this.camera);let n=this.canvas.clientWidth,i=this.canvas.clientHeight,r=(this.a.x+1)*n/2,o=(1-this.a.y)*i/2-(e.startsWith("fleet:")?13:8),a=this.a.z<-1||this.a.z>1||r<12||r>n-12||o<this.viewportTop+14||o>this.viewportBottom-14,l=r>n/2?o<(this.viewportTop+this.viewportBottom)/2?"\u2197":"\u2198":o<(this.viewportTop+this.viewportBottom)/2?"\u2196":"\u2199";return!e.startsWith("fleet:")&&this.a.z>1?null:(r=Math.max(14,Math.min(n-14,r)),o=Math.max(this.viewportTop+18,Math.min(this.viewportBottom-18,o)),{x:r,y:o,offscreen:a,arrow:l})}focusBounds(e){if(this.mode==="overview")return null;let t=this.ships.get(this.mode==="target"?e.target:e.selected);if(!t?.group.visible)return null;let n=1/0,i=-1/0,r=1/0,o=-1/0;for(let a of[-1,1])for(let l of[-1,1])for(let c of[-1,1]){if(this.a.set(a*t.size.x/2,l*t.size.y/2,c*t.size.z/2).applyMatrix4(t.group.matrixWorld).project(this.camera),this.a.z<-1||this.a.z>1)return null;let h=(this.a.x+1)*this.canvas.clientWidth/2,d=(1-this.a.y)*this.canvas.clientHeight/2;n=Math.min(n,h),i=Math.max(i,h),r=Math.min(r,d),o=Math.max(o,d)}return n=Math.max(8,n-7),i=Math.min(this.canvas.clientWidth-8,i+7),r=Math.max(this.viewportTop+8,r-7),o=Math.min(this.viewportBottom-8,o+7),i-n<10||o-r<6?null:{x:n,y:r,width:i-n,height:o-r}}releaseObjects(e){let t=new Set,n=new Set,i=new Set;for(let o of e)o.traverse(a=>{a.geometry&&t.add(a.geometry);for(let l of Array.isArray(a.material)?a.material:a.material?[a.material]:[]){n.add(l);for(let c of Object.values(l))c?.isTexture&&i.add(c)}});for(let o of t)o.dispose();for(let o of n)o.dispose();let r=new Set;for(let o of i)o.image&&r.add(o.image),o.dispose();for(let o of r)o.close?.()}dispose(){if(!this.disposed){this.disposed=!0,this.loadingManager.abort(),this.controls.dispose(),this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(let[e,t]of[["pointerdown",this.pointerStart],["pointermove",this.pointerMove],["pointerup",this.pointerEnd],["pointercancel",this.pointerCancel]])this.canvas.removeEventListener(e,t);this.releaseObjects([this.scene,...this.models.values()]),this.models.clear(),this.ships.clear(),this.presentation.dispose(),this.environmentTarget.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss()}}};var Ah={cruiser:{model:"harbinger",length:72,rotationY:Math.PI/2,mount:[0,.055,-.48]},destroyer:{model:"challenger",length:36,rotationY:Math.PI,mount:[0,.1,-.46]},corvette:{model:"striker",length:14,rotationY:Math.PI,mount:[0,.1,-.43]},interceptor:{model:"spitfire",length:2.4,rotationY:Math.PI,mount:[0,.04,-.45]}};function ep(s,e){let t=s.ships.filter(r=>r.side===e&&xt(r)),n=t.filter(r=>r.type!=="interceptor"),i=n.length?n:t;return i.length?[0,1,2].map(r=>i.reduce((o,a)=>o+a.position[r],0)/i.length):[0,0,e==="friendly"?1e3:-1e3]}function tp(s,e=24){let t=s.attributes.position;if(t.count<250)return s;s.computeBoundingBox();let n=s.boundingBox.getSize(new w),i=Math.max(n.x,n.y,n.z)/e;if(!i)return s;let r=[],o=new Map,a=new Uint32Array(t.count),l=s.attributes.uv;for(let u=0;u<t.count;u++){let p=t.getX(u),g=t.getY(u),m=t.getZ(u),A=`${Math.round(p/i)}:${Math.round(g/i)}:${Math.round(m/i)}`,x=o.get(A);x===void 0&&(x=r.length,o.set(A,x),r.push([0,0,0,0,0,0]));let v=r[x];v[0]+=p,v[1]+=g,v[2]+=m,v[3]+=l?.getX(u)??0,v[4]+=l?.getY(u)??0,v[5]++,a[u]=x}let c=s.index?.array??Uint32Array.from({length:t.count},(u,p)=>p),h=[],d=new Set;for(let u=0;u<c.length;u+=3){let p=a[c[u]],g=a[c[u+1]],m=a[c[u+2]];if(p===g||g===m||p===m)continue;let A=[p,g,m].sort((x,v)=>x-v).join(":");d.has(A)||(d.add(A),h.push(p,g,m))}if(!h.length||h.length>=c.length*.85)return s;let f=new Je;return f.setAttribute("position",new Ze(r.flatMap(u=>u.slice(0,3).map(p=>p/u[5])),3)),l&&f.setAttribute("uv",new Ze(r.flatMap(u=>[u[3]/u[5],u[4]/u[5]]),2)),f.setIndex(h),f.computeVertexNormals(),f.computeBoundingSphere(),f}function np(s,e){let t=hh(s,e),n=[],i=new Set;for(let r of t){if(r.order==="retreat"||!lh(r))continue;let o=r.targeting==="target"?s.ships.find(l=>l.id===r.commandTarget&&l.side!==r.side&&xt(l)):zf(s,r);if(!o)continue;let a=Math.hypot(...o.position.map((l,c)=>l-r.position[c]));n.push({source:r.id,target:o.id,waiting:a>ch(r),mode:r.targeting}),i.add(o.id)}return{sources:t.map(r=>r.id),targets:[...i],links:n}}var Ja=class{constructor(e){let t=new Je().setAttribute("position",new Ge(new Float32Array(600),3).setUsage(_t));t.setAttribute("lineDistance",new Ge(new Float32Array(200),1).setUsage(_t)),t.setDrawRange(0,0),this.lines=new pn(t,new Jr({color:7713994,dashSize:18,gapSize:16,transparent:!0,opacity:.32,depthTest:!1,depthWrite:!1,toneMapped:!1})),this.lines.frustumCulled=!1,this.lines.renderOrder=18,this.lines.visible=!1;let n=new Je;for(let[i,r]of[["position",3],["role",1]])n.setAttribute(i,new Ge(new Float32Array(100*r),r).setUsage(_t));n.setDrawRange(0,0),this.points=new En(n,new ht({transparent:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:{pixelRatio:{value:1}},vertexShader:"attribute float role;varying float vRole;uniform float pixelRatio;void main(){vRole=role;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(role>.5?18.:14.)*pixelRatio;}",fragmentShader:"varying float vRole;void main(){vec2 p=gl_PointCoord*2.-1.;float r=vRole>.5?abs(p.x)+abs(p.y):length(p);float a=smoothstep(.65,.77,r)*(1.-smoothstep(.9,1.,r));gl_FragColor=vec4(mix(vec3(.44,.82,.9),vec3(.95,.68,.4),vRole),a*.75);}"})),this.points.frustumCulled=!1,this.points.renderOrder=22,this.points.visible=!1,this.paths=new pn(new Je().setAttribute("position",new Ge(new Float32Array(1800),3).setUsage(_t)),new nn({color:9553317,transparent:!0,opacity:.32,depthTest:!1,depthWrite:!1,toneMapped:!1})),this.paths.geometry.setDrawRange(0,0),this.paths.frustumCulled=!1,this.paths.renderOrder=17,e.add(this.lines,this.points,this.paths),this.state={sources:[],targets:[],links:[]}}ensureCapacity(e){if(!(this.points.geometry.attributes.position.count>=e)){for(let[t,n]of[["position",3],["role",1]])this.points.geometry.setAttribute(t,new Ge(new Float32Array(e*n),n).setUsage(_t));for(let[t,n]of[["position",3],["lineDistance",1]])this.lines.geometry.setAttribute(t,new Ge(new Float32Array(e*2*n),n).setUsage(_t));this.paths.geometry.setAttribute("position",new Ge(new Float32Array(e*18),3).setUsage(_t))}}update(e,t,n,i,r=!0){this.ensureCapacity(e.ships.length),this.state=np(e,t);let o=new Map(e.ships.map(p=>[p.id,p])),a=this.lines.geometry.attributes.position,l=this.lines.geometry.attributes.lineDistance,c=0;for(let p of this.state.links)a.setXYZ(c*2,...o.get(p.source).position),a.setXYZ(c*2+1,...o.get(p.target).position),c++,l.setX(c*2-2,0),l.setX(c*2-1,Math.hypot(...o.get(p.source).position.map((g,m)=>g-o.get(p.target).position[m])));a.needsUpdate=l.needsUpdate=!0,this.lines.geometry.setDrawRange(0,c*2),this.lines.material.opacity=c>12?.16:.32,this.lines.visible=n&&r&&c>0;let h=this.points.geometry.attributes;c=0;for(let[p,g]of[[this.state.sources,0],[this.state.targets,1]])for(let m of p)h.position.setXYZ(c,...o.get(m).position),h.role.setX(c++,g);h.position.needsUpdate=h.role.needsUpdate=!0,this.points.geometry.setDrawRange(0,c),this.points.material.uniforms.pixelRatio.value=i,this.points.visible=n&&c>0;let d=new Set(this.state.sources.map(p=>o.get(p)?.group)),f=this.paths.geometry.attributes.position,u=0;for(let p of e.navigation?.groups??[]){if(!d.has(p.id))continue;let g=e.navigation.fleets.find(x=>x.side===p.side),m=["fleet","regroup"].includes(p.mode)?[[...g.anchor].map((x,v)=>x+p.offset[v])]:p.route.slice(p.stage);(p.mode==="hold"||p.mode==="fleet"&&g.mode==="hold")&&(m=[]),p.mode==="fleet"&&g.mode!=="hold"&&(m=g.route.slice(g.stage).map(x=>x.map((v,y)=>v+p.offset[y])));let A=p.anchor;for(let x of m)Math.hypot(...x.map((v,y)=>v-A[y]))>5&&(f.setXYZ(u++,...A),f.setXYZ(u++,...x)),A=x}f.needsUpdate=!0,this.paths.geometry.setDrawRange(0,u),this.paths.visible=n&&u>0}};var ip=class extends Ya{constructor(e,t={}){super(e,t),this.overviewFollowsFleet=!0,this.abort=new AbortController,this.graphics="auto",this.onAssetProgress=t.onAssetProgress,this.renderer.toneMappingExposure=1.18,this.scene.environmentIntensity=1.6,this.camera.fov=38,this.camera.near=.15,this.farField=new zt;for(let a of[...this.scene.children])(a.isPoints||a.isMesh&&a.geometry.parameters?.radius===27e3)&&this.farField.add(a);this.scene.add(this.farField);for(let a of this.farField.children)a.isMesh&&a.material.color.setScalar(5);let n=this.farField.children.find(a=>a.isPoints);if(n){let a=3077,l=()=>(a=Math.imul(a,1664525)+1013904223>>>0,a/4294967296),c=[],h=[],d=new w;for(let f=0;f<4500;f++){d.set(l()-.5,l()-.5,l()-.5).normalize().multiplyScalar(14e3+l()*8e3),c.push(d.x,d.y,d.z);let u=.18+l()*.65;h.push(u*.7,u*.85,u)}n.geometry.dispose(),n.geometry=new Je,n.geometry.setAttribute("position",new Ze(c,3)),n.geometry.setAttribute("color",new Ze(h,3)),n.material.size=.8,n.material.opacity=.7}[this.sun,this.rim]=this.scene.children.filter(a=>a.isDirectionalLight),this.sun.color.set(16772051),this.sun.intensity=5.6,this.rim.color.set(10208494),this.rim.intensity=2.4,this.scene.add(this.sun.target,this.rim.target),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ta,this.renderer.shadowMap.autoUpdate=!1,this.sun.castShadow=!0,this.sun.shadow.mapSize.set(1024,1024),Object.assign(this.sun.shadow.camera,{left:-34,right:34,top:34,bottom:-34,near:10,far:1500}),this.sun.shadow.bias=-12e-5,this.sun.shadow.normalBias=.025,this.lastShadow=-10,this.ktx=new xi(this.loadingManager).setTranscoderPath(new URL("../vendor/basis/",import.meta.url).href).setWorkerLimit(2).detectSupport(this.renderer);for(let a of["coreBatch","plumeBatch"]){let l=this[a],c=new Zt(l.geometry,l.material,512);c.count=0,c.frustumCulled=!1,c.instanceMatrix.setUsage(_t),l.removeFromParent(),l.dispose(),this.scene.add(c),this[a]=c}this.coreBatch.material.color.set(16777215).multiplyScalar(3),this.plumeBatch.geometry.dispose(),this.plumeBatch.material.dispose();let i=new ci(.42,3.6,24,8,!0);i.rotateX(Math.PI/2),i.translate(0,0,1.85),this.plumeBatch.geometry=i,this.plumeBatch.setColorAt(0,new fe(16759426)),this.plumeBatch.material=new ht({uniforms:{time:{value:0}},transparent:!0,depthWrite:!1,blending:an,side:on,toneMapped:!1,vertexShader:`varying vec2 vUv;varying vec3 vTint;varying vec3 vNormal;varying vec3 vView;
      void main(){vUv=uv;vTint=instanceColor;vec4 p=modelViewMatrix*instanceMatrix*vec4(position,1.);
      vNormal=normalize(normalMatrix*mat3(instanceMatrix)*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`,fragmentShader:`uniform float time;varying vec2 vUv;varying vec3 vTint;varying vec3 vNormal;varying vec3 vView;
      void main(){float edge=pow(abs(dot(normalize(vNormal),normalize(vView))),1.7);float tail=pow(1.-vUv.y,2.4);
      float fade=smoothstep(0.,.06,vUv.y)*(1.-smoothstep(.7,1.,vUv.y));float bands=.85+.15*sin(vUv.y*38.-time*17.);
      gl_FragColor=vec4(mix(vTint*1.7,vTint*.25,vUv.y),edge*tail*bands*fade*.46);}`});let r=[];for(let a=-2e3;a<=2e3;a+=500)r.push(a,-55,-2e3,a,-55,2e3,-2e3,-55,a,2e3,-55,a);this.grid=new pn(new Je().setAttribute("position",new Ze(r,3)),new nn({color:4944009,transparent:!0,opacity:.18,depthWrite:!1})),this.scene.add(this.grid),this.orders=new pn(new Je().setAttribute("position",new Ge(new Float32Array(48),3)),new nn({color:6986424,transparent:!0,opacity:.3,depthWrite:!1})),this.orders.geometry.setDrawRange(0,0),this.orders.frustumCulled=!1,this.scene.add(this.orders),this.hullBatches=[],this.selectionOverlay=new Ja(this.scene);let o=new Je;o.setAttribute("position",new Ge(new Float32Array(300),3).setUsage(_t)),o.setAttribute("side",new Ge(new Float32Array(100),1).setUsage(_t)),o.setAttribute("opacity",new Ge(new Float32Array(100),1).setUsage(_t)),o.setDrawRange(0,0),this.contactPoints=new En(o,new ht({transparent:!0,depthWrite:!1,depthTest:!1,toneMapped:!1,uniforms:{pixelRatio:{value:this.pixelRatio},height:{value:1}},vertexShader:`attribute float side;attribute float opacity;varying float vSide;varying float vOpacity;uniform float pixelRatio;uniform float height;
      void main(){vSide=side;vOpacity=opacity;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);p.y+=8./height*p.w;gl_Position=p;gl_PointSize=5.*pixelRatio;}`,fragmentShader:"varying float vSide;varying float vOpacity;void main(){vec2 p=gl_PointCoord*2.-1.;float d=vSide>.5?abs(p.x)+abs(p.y):max(abs(p.x)*.87+p.y*.5,-p.y);float a=1.-smoothstep(.7,1.,d);gl_FragColor=vec4(mix(vec3(.32,.82,.94),vec3(1.,.57,.24),vSide),a*vOpacity);}"})),this.contactPoints.frustumCulled=!1,this.contactPoints.renderOrder=20,this.scene.add(this.contactPoints),this.selectionPoint=new En(new Je().setAttribute("position",new Ze([0,0,0],3)),new ht({uniforms:{pixelRatio:{value:this.pixelRatio},color:{value:new fe(7393509)}},transparent:!0,depthWrite:!1,depthTest:!1,toneMapped:!1,vertexShader:"uniform float pixelRatio;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=17.*pixelRatio;}",fragmentShader:"uniform vec3 color;void main(){float r=length(gl_PointCoord-.5)*2.;float a=smoothstep(.65,.78,r)*(1.-smoothstep(.88,1.,r));gl_FragColor=vec4(color,a*.85);}"})),this.selectionPoint.frustumCulled=!1,this.selectionPoint.renderOrder=21,this.selectionPoint.visible=!1,this.scene.add(this.selectionPoint)}makePlanet(){}async load(e){this.ensureCapacity(e.ships.length);let t=this.abort.signal,n=new URL("../models/harbinger/",import.meta.url),i=await fetch(new URL("manifest.json",n),{signal:t});if(!i.ok)throw new Error("Model manifest unavailable");let r=await i.json(),o=new Array(r.parts.length),a=0,l=0;await Promise.all(Array.from({length:4},async()=>{for(;a<r.parts.length;){let u=a++,p=r.parts[u],g=await fetch(new URL(p.file,n),{signal:t});if(!g.ok)throw new Error("Model part unavailable");let m=new Uint8Array(await g.arrayBuffer());if(m.byteLength!==p.bytes)throw new Error("Incomplete model part");o[u]=m,l+=m.byteLength,this.onAssetProgress?.(l,r.bytes)}}));let c=new Uint8Array(r.bytes),h=0;for(let u=0;u<o.length;u++)c.set(o[u],h),h+=o[u].length,o[u]=null;if(new DataView(c.buffer).getUint32(8,!0)!==r.bytes)throw new Error("Incomplete model");let d=new vr(this.loadingManager).setKTX2Loader(this.ktx),f=await d.parseAsync(c.buffer,n.href);if(this.disposed){this.releaseObjects([f.scene]);return}this.models.set("harbinger",f.scene);for(let u of["challenger","striker","spitfire"]){let p=await d.loadAsync(new URL(`../models/quaternius/${u}.glb`,import.meta.url).href);if(this.disposed){this.releaseObjects([p.scene]);return}this.models.set(u,p.scene)}for(let u of e.ships)this.makeShip(u);this.makeHullBatches(e),this.battle=e,this.resize(),this.setMode("overview",e,!1),this.beforeRender(e,0),await this.renderer.compileAsync(this.scene,this.camera)}modelName(e){return Ah[e.type].model}orientBody(e,t){e.rotation.y=Ah[t.type].rotationY}visibleShip(e,t,n){return super.visibleShip(e,t,n)?this.mode==="ship"||this.mode==="target"?e.id===this.focusId:this.mode!=="fleet"||e.side==="friendly":!1}prepareMaterial(e,t){if(t.type!=="cruiser")return super.prepareMaterial(e,t);e.material=e.material.clone(),e.material.envMapIntensity=1.15,e.material.emissiveIntensity=2.2,e.castShadow=!e.material.transparent,e.receiveShadow=!0,e.userData.authoredMaterial=!0,e.userData.baseColor=e.material.color.clone(),e.userData.baseEmissive=e.material.emissive.clone();for(let n of["map","normalMap","metalnessMap","roughnessMap","aoMap"])e.material[n]&&(e.material[n].anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy()))}updateMaterial(e,t,n){if(!e.userData.authoredMaterial)return super.updateMaterial(e,t,n);e.material.color.copy(e.userData.baseColor).multiplyScalar(n?.78+.22*t:.18),e.material.emissive.copy(e.userData.baseEmissive),e.material.emissiveIntensity=n?2.2*(.5+.5*t):0}makeShip(e){super.makeShip(e);let t=this.ships.get(e.id);if(t.authoredGuns=!0,t.fixedWeapons=!0,t.meshes=[],t.body.traverse(u=>{u.isMesh&&t.meshes.push(u)}),e.type!=="cruiser")return;if(t.engineColor=16758133,this.engineTemplate){for(let u of t.engines)u.engine.removeFromParent();t.engines=[];for(let u of this.engineTemplate){let p=new qe,g=new qe;p.position.fromArray(u.position),p.quaternion.fromArray(u.quaternion),g.scale.x=g.scale.y=1.35,p.add(g),t.body.add(p),t.engines.push({engine:p,plume:g})}return}let n;if(t.body.traverse(u=>{u.isMesh&&u.material.name==="MainEngineGlow"&&(n=u)}),!n)return;let i=n.geometry.attributes.position,r=n.geometry.attributes.normal,o=n.geometry.index?.array??Array.from({length:i.count},(u,p)=>p),a=Array.from({length:i.count},(u,p)=>p),l=u=>{for(;a[u]!==u;)a[u]=a[a[u]],u=a[u];return u},c=(u,p)=>{a[l(u)]=l(p)},h=new Map;for(let u=0;u<i.count;u++){let p=[i.getX(u),i.getY(u),i.getZ(u)].map(g=>Math.round(g*1e4)).join(":");h.has(p)?c(u,h.get(p)):h.set(p,u)}for(let u=0;u<o.length;u+=3)c(o[u],o[u+1]),c(o[u],o[u+2]);let d=new Map;for(let u=0;u<i.count;u++){let p=l(u);d.has(p)||d.set(p,{center:new w,normal:new w,count:0});let g=d.get(p);g.center.add(new w().fromBufferAttribute(i,u)),g.normal.add(new w().fromBufferAttribute(r,u)),g.count++}if(d.size>8)return;for(let u of t.engines)u.engine.removeFromParent();t.engines=[],n.updateWorldMatrix(!0,!1);let f=t.body.getWorldQuaternion(new bt).invert();for(let u of d.values()){let p=u.center.divideScalar(u.count).applyMatrix4(n.matrixWorld),g=u.normal.normalize().transformDirection(n.matrixWorld).applyQuaternion(f).normalize(),m=new qe,A=new qe;m.position.copy(t.body.worldToLocal(p)).addScaledVector(g,.15),m.quaternion.setFromUnitVectors(new w(0,0,1),g),A.scale.x=A.scale.y=1.35,m.add(A),t.body.add(m),t.engines.push({engine:m,plume:A})}this.engineTemplate=t.engines.map(({engine:u})=>({position:u.position.toArray(),quaternion:u.quaternion.toArray()}))}ensureCapacity(e){this.effects.ensureCapacity(e),this.selectionOverlay.ensureCapacity(e);let t=this.contactPoints.geometry;if(t.attributes.side.count<e)for(let[n,i]of[["position",3],["side",1],["opacity",1]])t.setAttribute(n,new Ge(new Float32Array(e*i),i).setUsage(_t));for(let n of["coreBatch","plumeBatch"]){let i=this[n];if(i.instanceMatrix.count>=e*5)continue;let r=new Zt(i.geometry,i.material,e*5);r.count=0,r.frustumCulled=!1,r.instanceMatrix.setUsage(_t),r.setColorAt(0,new fe(16777215)),i.removeFromParent(),i.dispose(),this.scene.add(r),this[n]=r}}makeHullBatches(e){for(let t of new Set(e.ships.map(n=>this.modelName(n)))){let n=e.ships.filter(r=>this.modelName(r)===t).map(r=>this.ships.get(r.id));if(!n.length)continue;let i=n[0];for(let r=0;r<i.meshes.length;r++){let o=i.meshes[r],a=o.material.clone(),l=new Zt(tp(o.geometry,n.length>16?12:24),a,n.length);l.count=0,l.frustumCulled=!1,l.instanceMatrix.setUsage(_t),l.setColorAt(0,new fe(16777215)),this.scene.add(l),this.hullBatches.push({mesh:l,members:n,index:r})}}}pickContact(e,t){if(!this.battle)return null;let n=null,i=22,r=new w;for(let o of this.battle.ships){let a=this.ships.get(o.id);if(!xt(o)||!a?.group.visible||(r.copy(a.group.position).project(this.camera),r.z<-1||r.z>1))continue;let l=Math.hypot((r.x+1)*this.canvas.clientWidth/2-e,(1-r.y)*this.canvas.clientHeight/2-t);l<i&&(i=l,n=o.id)}return n}updateAttachments(e,t){super.updateAttachments(e,t);let n=0;for(let i of e.ships){let r=this.ships.get(i.id);if(!(!r?.group.visible||!xt(i)))for(let o of r.engines)this.coreBatch.setColorAt(n++,new fe(r.engineColor??11066879))}this.coreBatch.instanceColor&&(this.coreBatch.instanceColor.needsUpdate=!0)}resize(){if(this.disposed)return;let e=Math.max(1,this.canvas.clientWidth),t=Math.max(1,this.canvas.clientHeight);this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.presentation.resize(e,t,this.pixelRatio);let n=t<650?0:8;this.viewportTop=(document.querySelector(".lab-top")?.getBoundingClientRect().bottom??60)+n,this.viewportBottom=(document.querySelector(".lab-bottom")?.getBoundingClientRect().top??t-60)-n,this.contactPoints&&(this.contactPoints.material.uniforms.pixelRatio.value=this.pixelRatio,this.contactPoints.material.uniforms.height.value=t),this.selectionPoint&&(this.selectionPoint.material.uniforms.pixelRatio.value=this.pixelRatio),this.frameProjection(),this.dirty=!0}frameProjection(){let e=this.canvas.clientWidth,t=this.canvas.clientHeight;this.viewportFocusY=this.mode==="overview"?this.viewportTop+(this.viewportBottom-this.viewportTop)*.7:(this.viewportTop+this.viewportBottom)/2,this.camera.setViewOffset(e,t,0,t/2-this.viewportFocusY,e,t),this.camera.updateProjectionMatrix()}setMode(e,t,n=!0,i=null){let r=this.camera.position.clone(),o=this.controls.target.clone();this.mode=e,this.effects.overview=e==="overview",this.camera.userData.viewportHeight=this.canvas.clientHeight,this.camera.fov=e==="overview"?30:38,this.camera.updateProjectionMatrix(),this.frameProjection(),this.inspectionId=["ship","target"].includes(e)?i:null,this.focusId=this.inspectionId??(e==="target"?t.target:t.selected);let a=this.ships.get(this.focusId);if(this.controls.touches.ONE=An.ROTATE,this.controls.mouseButtons.LEFT=Wn.ROTATE,this.controls.maxDistance=e==="overview"?22e3:12e3,this.controls.screenSpacePanning=!0,(e==="ship"||e==="target")&&a){let l=e==="target"?-1:1;this.controls.target.copy(a.group.position),this.camera.position.copy(this.controls.target).add(new w(l*1.1,1.9,l*1.8)),this.controls.minDistance=Math.max(a.size.x,a.size.y,a.size.z)*.75,this.fit([a])}else e==="overview"?(this.controls.target.fromArray(Mi(t,"friendly")),this.camera.position.copy(this.controls.target).add(new w(.12,.643,.756)),this.controls.minDistance=18,this.fit(t.ships.filter(xt).map(l=>this.ships.get(l.id))),this.controls.maxDistance=Math.max(this.controls.maxDistance,this.camera.position.distanceTo(this.controls.target)*2)):(this.controls.target.fromArray(Mi(t,"friendly")),this.camera.position.copy(this.controls.target).add(new w(90,82,180)),this.controls.minDistance=35,this.fit(t.ships.filter(l=>l.side==="friendly"&&xt(l)).map(l=>this.ships.get(l.id))));this.followed.copy(this.controls.target),this.transition=n&&!matchMedia("(prefers-reduced-motion: reduce)").matches?{position:r,target:o,endPosition:this.camera.position.clone(),endTarget:this.controls.target.clone(),elapsed:0}:null,this.transition&&(this.camera.position.copy(r),this.controls.target.copy(o)),this.controls.update(),this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0}fit(e){this.camera.lookAt(this.controls.target),this.camera.updateMatrixWorld();let t=new w().setFromMatrixColumn(this.camera.matrixWorld,0),n=new w().setFromMatrixColumn(this.camera.matrixWorld,1),i=new w().setFromMatrixColumn(this.camera.matrixWorld,2),r=this.canvas.clientHeight,o=this.viewportFocusY,a=this.camera.projectionMatrix.elements[5],l=this.camera.projectionMatrix.elements[0],c=Math.max(40,o-this.viewportTop-28)*2/r,h=Math.max(40,this.viewportBottom-o-24)*2/r,d=this.controls.minDistance*1.2,f=new w,u=new w,p=g=>{u.copy(g).sub(this.controls.target);let m=u.dot(t),A=u.dot(n),x=u.dot(i);d=Math.max(d,x+Math.abs(m)*l/.9,x+A*a/(A>=0?c:-h))};for(let g of e){g.group.updateWorldMatrix(!0,!0);for(let m of[-1,1])for(let A of[-1,1])for(let x of[-1,1])p(f.set(m*g.size.x/2,A*g.size.y/2,x*g.size.z/2).applyMatrix4(g.group.matrixWorld));for(let{engine:m}of g.engines)p(m.localToWorld(f.set(0,0,4)))}this.camera.position.copy(this.controls.target).addScaledVector(i,d*(this.mode==="overview"?1.07:1.04)),this.camera.far=Math.max(35e3,d*3),this.camera.updateProjectionMatrix()}labelPosition(e,t){if(!e.startsWith("fleet:"))return super.labelPosition(e,t);let n=e.split(":")[1],i=new w().fromArray(ep(t,n)).project(this.camera),r=new w,o=1/0,a=-1/0;for(let l of t.ships)if(l.side===n&&xt(l)){if(r.fromArray(l.position).project(this.camera),r.z<-1||r.z>1)continue;let c=(1-r.y)*this.canvas.clientHeight/2;o=Math.min(o,c),a=Math.max(a,c)}return{x:(i.x+1)*this.canvas.clientWidth/2,y:(1-i.y)*this.canvas.clientHeight/2,top:o,bottom:a,offscreen:i.z<-1||i.z>1||Math.abs(i.x)>1||Math.abs(i.y)>.9,arrow:i.x>1?"\u2192":i.x<-1?"\u2190":i.y>0?"\u2191":"\u2193"}}beforeRender(e,t){this.battle=e,this.farField.position.copy(this.camera.position),this.plumeBatch.material.uniforms.time.value=t,this.grid.visible=!1,this.orders.visible=!1,this.selectionOverlay.update(e,this.tacticalSelection,["overview","fleet"].includes(this.mode),this.pixelRatio,this.showSelectionLinks!==!1);let n=0,i=this.orders.geometry.attributes.position.array;for(let p of Ha(e)){let g=Va(e,p);g&&n<8&&(i.set(p.position,n*6),i.set(g.position,n*6+3),n++)}this.orders.geometry.setDrawRange(0,n*2),this.orders.geometry.attributes.position.needsUpdate=!0,this.orders.material.color.set(Ha(e).some(p=>p.targeting==="target")?15118978:6986424);let r=0,o=this.contactPoints.geometry.attributes.position,a=this.contactPoints.geometry.attributes.side,l=this.contactPoints.geometry.attributes.opacity,c=this.canvas.clientHeight,h=this.camera.projectionMatrix.elements[5];for(let p of e.ships){let g=this.ships.get(p.id),m=(p.length??Sn[p.type].size)*h*c/(2*Math.max(1,this.camera.position.distanceTo(g.group.position)));g.distant=g.group.visible&&m<40,g.body.visible=!g.distant,g.group.visible&&xt(p)&&this.mode==="overview"&&m<15&&(o.setXYZ(r,...p.position),a.setX(r,p.side==="enemy"?1:0),l.setX(r++,m<6?.8:.4))}this.contactPoints.visible=r>0,this.contactPoints.geometry.setDrawRange(0,r);let d=this.ships.get(this.highlightId),f=e.ships.find(p=>p.id===this.highlightId);this.selectionPoint.visible=this.mode==="overview"&&!!(d?.group.visible&&f&&xt(f)),this.selectionPoint.visible&&(this.selectionPoint.position.copy(d.group.position),this.selectionPoint.material.uniforms.color.value.set(f.side==="enemy"?15838832:7393509));for(let p of[o,a,l])p.needsUpdate=!0;for(let p of this.hullBatches){let g=0;for(let m of p.members)m.distant&&(p.mesh.setMatrixAt(g,m.meshes[p.index].matrixWorld),p.mesh.setColorAt(g++,this.color.setScalar(m.living===!1?.22:1)));p.mesh.count=g,p.mesh.visible=g>0,p.mesh.instanceMatrix.needsUpdate=!0,p.mesh.instanceColor.needsUpdate=!0}let u=this.ships.get(this.focusId);u&&(this.sun.target.position.copy(u.group.position),this.sun.position.copy(u.group.position).add(new w(-400,680,350)),this.rim.target.position.copy(u.group.position),this.rim.position.copy(u.group.position).add(new w(400,150,-500))),this.sun.castShadow=this.graphics!=="fluid"&&this.mode!=="overview",(t-this.lastShadow>.18||this.transition||this.dirty)&&(this.renderer.shadowMap.needsUpdate=!0,this.lastShadow=t)}setGraphics(e){this.graphics=e,this.pixelRatio=e==="detail"?Math.min(1.75,devicePixelRatio||1):e==="fluid"?1:this.quality.ratio,this.renderer.setPixelRatio(this.pixelRatio),this.resize()}observeQuality(e,t){return this.graphics!=="auto"||!this.quality.observe(e,t)?!1:(this.pixelRatio=this.quality.ratio,this.renderer.setPixelRatio(this.pixelRatio),this.resize(),!0)}dispose(){this.disposed||(this.abort?.abort(),this.ktx?.dispose(),this.sun?.shadow.dispose(),super.dispose())}};export{ip as HarbingerScene};
