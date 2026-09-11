const APPS_SCRIPT_URL='https://script.google.com/macros/s/AKfycbyILLjW-gTPjUSMG-MaSSXK3hZT9voml0FqLeCZb4NBJ2xk6EV80XMu2eKdHNWbF5JuFQ/exec';
export default async function handler(req,res){
  try{
    const qs=new URLSearchParams(req.query||{});
    const url=APPS_SCRIPT_URL+'?'+qs.toString();
    const opts={method:req.method,headers:{'Accept':'application/json'}};
    if(req.method!=='GET'&&req.method!=='HEAD'){
      opts.headers['Content-Type']='application/json';
      opts.body=typeof req.body==='string'?req.body:JSON.stringify(req.body||{});
    }
    const r=await fetch(url,opts); const text=await r.text();
    res.status(r.status).setHeader('Content-Type','application/json; charset=utf-8').send(text);
  }catch(e){res.status(500).json({status:'erro',mensagem:'No se pudo conectar con la agenda.'});}
}
