export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fmt=v=>(v??0).toLocaleString('de-DE',{maximumFractionDigits:1});
export const opts=(values,selected)=>values.map(([id,label])=>`<option value="${esc(id)}" ${String(id)===String(selected)?'selected':''}>${esc(label)}</option>`).join('');
export const button=(label,action,data='',disabled=false)=>`<button class="button secondary" data-action="${action}" ${data} ${disabled?'disabled':''}>${label}</button>`;
