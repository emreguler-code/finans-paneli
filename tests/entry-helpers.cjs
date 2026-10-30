exports.more=async p=>{const b=p.locator('.entry-dock').getByRole('button',{name:'Diğer seçenekler',exact:true});if(await b.count()&&await b.getAttribute('aria-expanded')==='false')await b.click()};
exports.entry=p=>p.locator('[data-entry],.finance-sheet');
