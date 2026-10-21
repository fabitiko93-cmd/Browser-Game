"""Bake the three authored river valleys. Requires numpy/scipy (offline only).

The runtime samples prepared centimetre heights and ecology masks; it does not
run erosion, drainage or terrain construction on a phone. No external map data.
Art references: NPS meandering-stream.htm (cut banks / point bars), LGRB
Schwarzwald (open valley floors, wooded slopes, alluvial terraces).
Run: python scripts/bake-planet-valleys.py
"""
import base64, json, os, zlib
import numpy as np
from scipy.ndimage import gaussian_filter, zoom
from PIL import Image, ImageDraw
N=513; EXTENT=960; STEP=2*EXTENT/(N-1)
a=np.linspace(-EXTENT,EXTENT,N); X,Z=np.meshgrid(a,a)

def smooth(a,b,x):
 t=np.clip((x-a)/(b-a),0,1);return t*t*(3-2*t)
def noise(rng,scale):
 n=rng.random((scale,scale));return zoom(n,(N/scale,N/scale),order=3)[:N,:N]-.5
def gauss(x):return np.exp(-x*x)

def water_line(i,z):
 if i==0:
  x=-126+25*np.sin((z+40)/145)+12*np.sin(z/65);w=10.5+1.3*np.sin(z/95);level=2.8-z*.002
 elif i==1:
  x=-185+83*np.cos((z+30)/125)+13*np.sin(z/240);w=13+2*np.cos(z/85);level=2.5-z*.0017
 else:
  x=-132+29*np.tanh((z+65)/100)+16*np.sin((z+20)/105);w=8.5+1.5*np.cos(z/80);level=3.2-z*.003
 return x,w+.6*np.sin(z/13)+.35*np.sin(z/6),level

def erode(h,protect,rng):
 # Virtual-pipe hydraulic erosion. Rain, downhill water/sediment transport,
 # capacity-limited erosion/deposition, evaporation; then thermal relaxation.
 h=h.copy();water=np.zeros_like(h);sed=np.zeros_like(h);deposited=np.zeros_like(h)
 for _ in range(96):
  water+=.018
  surface=h+water
  drops=[np.maximum(0,surface-np.roll(surface,s,axis)) for axis,s in [(0,1),(0,-1),(1,1),(1,-1)]]
  total=sum(drops)+1e-9;rate=np.minimum(water*.62,total*.19)
  flux=[rate*d/total for d in drops];incoming=np.zeros_like(h);moved=np.zeros_like(h)
  for flow,(axis,s) in zip(flux,[(0,1),(0,-1),(1,1),(1,-1)]):
   incoming+=np.roll(flow,-s,axis);moved+=np.roll(sed*flow/(water+1e-9),-s,axis)
  carried=sed*rate/(water+1e-9);sed+=moved-carried;water=(water-rate+incoming)*.97
  capacity=np.maximum(.0001,np.maximum.reduce(drops)/STEP*rate*12)
  change=np.clip((capacity-sed)*.32,-.075,.075)*(1-protect)
  h-=change;sed+=change;deposited+=np.maximum(-change,0)
  water[[0,-1],:]=0;water[:,[0,-1]]=0;sed=np.maximum(sed,0)
 for _ in range(10):
  delta=np.zeros_like(h)
  for axis,s in [(0,1),(0,-1),(1,1),(1,-1)]:
   transfer=np.maximum(0,h-np.roll(h,s,axis)-STEP*.72)*.09*(1-protect)
   transfer[[0,-1],:]=0;transfer[:,[0,-1]]=0;delta+=np.roll(transfer,-s,axis)-transfer
  h+=delta
 return h,deposited

specs=[
 dict(id='meadow',name='Weites Wiesental',description='Ein breiter Wiesenboden mit feuchter Aue, Kiesufern und geschlossenen Laubwaldhängen. Die Kolonie liegt erhöht auf der trockenen Ostterrasse.',site='Wiesenterrasse',roads=[[[23,67],[18,35],[9,2],[13,-31],[28,-68]],[[9,2],[-20,-12],[-43,-20]]],pads=[[-23,25,24,24],[40,8,23,28],[-13,-43,28,22]],camera=[220,235,330],target=[-35,-50]),
 dict(id='meander',name='Große Flussschleife',description='Eine weite Flussschleife mit hellen Kiesbänken, Auwald und langen bewaldeten Rücken. Die Baufläche folgt dem höheren östlichen Gleithang.',site='Terrasse an der Flussschleife',roads=[[[48,66],[27,39],[6,19],[-14,-8],[-25,-40],[-20,-66]],[[6,19],[31,5],[51,-10]]],pads=[[34,-35,24,25],[-8,43,28,20],[-1,-31,20,23]],camera=[230,250,340],target=[-55,-55]),
 dict(id='woodland',name='Bewaldete Flussterrassen',description='Ein schmaleres Flusstal zwischen dicht bewachsenen Rücken, mit gestuften Ufern und feuchten Waldsäumen. Die Kolonie nutzt eine breite Lichtung oberhalb des Wassers.',site='Lichtung auf der Hochterrasse',roads=[[[43,66],[22,39],[-1,14],[-14,-13],[-7,-38],[12,-67]],[[22,39],[-5,45],[-37,37]]],pads=[[28,-17,27,25],[-37,6,22,24],[23,-47,24,21]],camera=[220,230,330],target=[-30,-55])
]
entries=[];os.makedirs('artifacts/valley',exist_ok=True)
for i,spec in enumerate(specs):
 rng=np.random.default_rng(30770+i*971);broad=noise(rng,8);medium=noise(rng,20);fine=noise(rng,70)
 cx,width,level=water_line(i,Z);dx=(water_line(i,Z+1)[0]-water_line(i,Z-1)[0])/2
 curvature=(water_line(i,Z+2)[0]-2*cx+water_line(i,Z-2)[0])/4
 signed=(X-cx)/np.sqrt(1+dx*dx);distance=np.abs(signed)
 inner=.5+.5*np.tanh(signed*.13)*np.tanh(curvature*180)
 # Long overlapping spurs, incised by tributary hollows, frame a connected
 # alluvial floor. Each template has a deliberately different valley section.
 left=(-330,-365,-280)[i]+(45,75,35)[i]*np.sin(Z/(290,220,175)[i]+i)
 right=(290,355,235)[i]+55*np.sin(Z/285+i*1.8)
 floor=6.8-Z*(.002,.0017,.003)[i]+medium*.65+fine*.09
 west=(67,78,82)[i]*gauss((X-left)/(155,195,125)[i])*(.73+.27*np.cos((Z+70)/245))
 east=(50,65,65)[i]*gauss((X-right)/(195,205,135)[i])*(.77+.23*np.cos((Z-100)/280))
 back=38*gauss((X-40)/500)*smooth(130,500,-Z)*(1+.25*np.sin(X/100))
 h=floor+(west+east+back)*(1+medium*.24)*smooth((75,85,65)[i],(300,320,270)[i],distance)+broad*6*smooth(160,300,np.abs(X))
 hollows=gauss((Z+140+np.sin(X/190)*100)/37)+.7*gauss((Z-180+np.sin(X/160)*80)/49)
 h-=hollows*smooth(140,370,np.abs(X))*(7+i*2)
 if i==2:
  # Two broad old terraces, not a noisy chain of spikes around the settlement.
  h+=smooth(75,115,X)*6+smooth(135,180,X)*9
 protect=1-smooth(.93,1.55,np.hypot(X/105,Z/113))
 target=6.8-Z*(.002,.0017,.003)[i]+X*.002+medium*.15
 h=h*(1-protect)+target*protect
 h,deposition=erode(h,protect,rng)
 h=h*(1-protect)+target*protect
 # Carve the same prepared channel that supplies the water mesh. Inside bends
 # have a broad depositional bar; outside bends expose a steeper cut bank.
 bank=(8+inner*(17,28,12)[i])*(1+fine*.3)
 channel=level-1.8*(1-smooth(0,width,distance))+3.4*smooth(width,width+bank,distance)
 blend=1-smooth(width+bank,width+bank+14,distance)
 h=h*(1-blend)+np.minimum(h,channel)*blend
 h=np.maximum(h,-6)
 slope=np.hypot(*np.gradient(h,STEP))
 # Authored ecological zoning, with irregular edges and small internal gaps.
 # The settlement is in a natural meadow; woodland is a contiguous mass on
 # each slope and a narrower riparian belt, never an arbitrary prop ring.
 woodland=smooth((120,155,78)[i],(210,260,150)[i],np.abs(X)+medium*65+fine*12)
 tongue=smooth((100,155,25)[i],(230,275,135)[i],-Z+45*np.sin(X/90))*smooth(-35,100,X)
 if i==2:tongue=np.maximum(tongue,smooth(50,170,Z+35*np.sin(X/100)))
 woodland=np.maximum(woodland,tongue)
 if i==2:woodland=np.maximum(woodland,.97)
 riparian=gauss((distance-width-bank-15)/21)*(.5,.7,.65)[i]
 patches=smooth(.02,.27,medium+fine*.2)
 forest=np.clip(np.maximum(woodland,riparian)-patches*.25,0,1)
 clearing=1-smooth(1,1.5,np.hypot((X-12)/(92,92,66)[i],(Z+4)/(142,135,82)[i])+medium*.65+fine*.18)
 if i==2:clearing=np.maximum(clearing,(1-smooth(.65,1.4,np.hypot((X+48)/62,(Z-22)/48)))*.94)
 forest*=1-clearing*.98
 forest*=smooth(width+bank*.4,width+bank+9,distance)*(1-smooth(.6,1.05,slope))
 moisture=np.clip(.54+gauss(distance/65)*.36+deposition*.5-medium*.1,0,1)
 bare=2.5+inner*bank*.55+fine*3
 sediment=(1-smooth(width+bare*.5,width+bare+3,distance))*smooth(width-2,width+2,distance)
 sediment=np.clip(sediment+smooth(.45,.85,slope)*.7,0,1)
 # Coarser ecology maps are bilinearly sampled; geometry remains centimetres.
 ecology=np.stack([forest,moisture,sediment],axis=-1)[::2,::2]
 quant=np.round((h+16)*100).astype('<u2')
 residual=np.diff(np.diff(np.pad(quant.astype('i4'),((1,0),(1,0))),axis=0),axis=1).astype('<i2')
 packed=zlib.compress(residual.tobytes()+np.round(ecology*255).astype('u1').tobytes(),9)
 spec.update(packed=base64.b64encode(packed).decode(),mapSize=N,ecologySize=(N+1)//2,extent=EXTENT)
 rz=np.arange(-EXTENT,EXTENT+1,3);rx,rw,rl=water_line(i,rz)
 spec['river']=[[round(float(x),4),round(float(w),4),round(float(l),4)] for x,w,l in zip(rx,rw,rl)]
 entries.append(spec)
 # Honest bake diagnostic (height, woodland, water), separate from 3D review.
 rgb=np.zeros((N,N,3));rgb[:]=[.39,.52,.27];rgb=rgb*(1-forest[:,:,None]*.55);rgb+=np.clip(h/240,0,.2)[:,:,None]
 wet=distance<width;rgb[wet]=[.19,.42,.47];rgb=np.uint8(np.clip(rgb,0,1)*255)
 im=Image.fromarray(rgb).resize((700,700));d=ImageDraw.Draw(im);d.text((12,12),spec['name'],fill='white');im.save('artifacts/valley/bake-'+spec['id']+'.png')
 print(spec['id'],'height',round(float(h.min()),2),round(float(h.max()),2),'forest',round(float(forest.mean()),3))
with open('src/planet-valley-data.js','w') as f:
 f.write('// Generated by scripts/bake-planet-valleys.py. Heights in cm; no external map data.\n')
 f.write('export const VALLEY_DATA = '+json.dumps(entries,ensure_ascii=False,separators=(',',':'))+';\n')
