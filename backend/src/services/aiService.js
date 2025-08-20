class AIService {
  constructor(){ this.stub = process.env.STUB_MODE === 'true'; }

  async classify(text){
    if(this.stub) return this.stubClassify(text);
    // If you add real LLM later, implement here.
    return {predictedCategory:'other', confidence:0.5};
  }

  stubClassify(text){
    const t = (text||'').toLowerCase();
    const score = (words)=> words.reduce((a,w)=> a + (t.includes(w)?1:0),0);
    const billing = score(['refund','invoice','payment','charge','bill','billing']);
    const tech = score(['error','bug','stack','crash','login','500']);
    const shipping = score(['delivery','shipment','package','tracking','delayed']);
    let cat='other', matches=0;
    if (billing>=tech && billing>=shipping && billing>0){ cat='billing'; matches=billing; }
    else if (tech>=shipping && tech>0){ cat='tech'; matches=tech; }
    else if (shipping>0){ cat='shipping'; matches=shipping; }
    const confidence = Math.min(0.3 + matches*0.2, 0.95);
    return {predictedCategory:cat, confidence};
  }

  async draft(text, articles){
    const lines = (articles||[]).map((a,i)=> `${i+1}. ${a.title}`);
    return {
      draftReply: `Thanks for reaching out. These may help:\n\n${lines.join('\n')}\n\nIf this resolves your issue, we'll close the ticket.`,
      citations: (articles||[]).map(a=> String(a._id))
    };
  }
}
module.exports = new AIService();
