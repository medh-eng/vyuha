import subprocess,sys,numpy as np
for f in sys.argv[1:]:
    raw=subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar','8000','-f','f32le','-'],capture_output=True).stdout
    x=np.frombuffer(raw,np.float32); w=400  # 50ms
    n=len(x)//w; r=np.sqrt((x[:n*w].reshape(n,w)**2).mean(1))+1e-9
    db=20*np.log10(r/r.max()); pk=int(db.argmax())
    def last(th): idx=np.where(db>th)[0]; return (idx[-1]+1)*0.05
    print(f"{f.split('/')[-1]:22s} len={len(x)/8000:.2f}s peak@{pk*0.05:.2f}s  >-12dB until {last(-12):.2f}s  >-20dB until {last(-20):.2f}s  >-30dB until {last(-30):.2f}s")
