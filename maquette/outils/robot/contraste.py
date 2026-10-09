# Calcule le contraste texte / fond réel (fond = pixels photographiés derrière le texte). Usage : python3 contraste.py sortie.json
import json,sys,re
from PIL import Image
def lin(c):
    c=c/255;return c/12.92 if c<=.03928 else ((c+.055)/1.055)**2.4
def L(r,g,b): return .2126*lin(r)+.7152*lin(g)+.0722*lin(b)
D=json.load(open(sys.argv[1]));res=[]
for e in D:
    m=re.findall(r'[\d.]+',e['c']);
    if len(m)<3: continue
    r,g,b=[float(x) for x in m[:3]];a=float(m[3]) if len(m)>3 else 1
    im=Image.open(e['f']).convert('RGB');px=list(im.get_flattened_data()) if hasattr(im,"get_flattened_data") else list(im.getdata())
    if not px: continue
    # fond : la luminance la plus défavorable parmi la moyenne et les quartiles
    ls=sorted(L(*p) for p in px);moy=sum(ls)/len(ls);q1=ls[len(ls)//4];q3=ls[3*len(ls)//4]
    pr=[sum(p[i] for p in px)/len(px) for i in range(3)]
    if a<1: r,g,b=[a*c+(1-a)*f for c,f in zip((r,g,b),pr)]
    lt=L(r,g,b)
    def ratio(lf): return (max(lt,lf)+.05)/(min(lt,lf)+.05)
    rmin=min(ratio(moy),ratio(q1),ratio(q3))
    grand=e['fs']>=24 or (e['fs']>=18.66 and e['fw']>=700)
    seuil=3 if grand else 4.5
    res.append((rmin<seuil,e['taille'],e['ecran'],e['t'],round(rmin,2),seuil,e['fs']))
bad=[x for x in res if x[0]]
print('textes mesurés :',len(res),' sous le seuil :',len(bad))
seen=set()
for x in sorted(bad,key=lambda x:x[4]):
    k=(x[2],x[3])
    print('- %s %s « %s » : %.2f (minimum %s, %spx)'%(x[1],x[2],x[3],x[4],x[5],x[6]))
