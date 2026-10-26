module.exports=async({p,go,ok,out})=>{
 const close=async()=>p.getByRole('button',{name:'Paneli kapat',exact:true}).last().click();
 async function supplier(){await go('Cari hesaplar');await p.locator('.party-row').filter({hasText:'Yıldız Tedarik'}).click();await p.locator('.summary-band').getByRole('button',{name:'Düzenle',exact:true}).click();await p.getByRole('dialog').waitFor();await p.getByText('Opsiyonel özellikler',{exact:true}).click()}
 await p.setViewportSize({width:1440,height:1000});await supplier();
 ok('Supplier optional POS has three independent checkboxes',await p.locator('.pos-options input[type=checkbox]').count()===3);
 await p.getByRole('checkbox',{name:'Garanti Bonus',exact:true}).check();await p.getByRole('checkbox',{name:'Yapı Kredi World',exact:true}).check();
 ok('Supplier can select multiple POS programs',await p.getByRole('checkbox',{name:'Garanti Bonus',exact:true}).isChecked()&&await p.getByRole('checkbox',{name:'Yapı Kredi World',exact:true}).isChecked());
 await p.locator('input[name=reason]').fill('POS seçenekleri denemesi');await p.screenshot({path:out+'/supplier-pos-desktop.png'});await p.getByRole('dialog').getByRole('button',{name:'Kaydet',exact:true}).click();await p.getByRole('dialog').waitFor({state:'hidden'});
 await p.reload();await p.locator('.app').waitFor();await supplier();
 ok('POS selections survive a full reload',await p.getByRole('checkbox',{name:'Garanti Bonus',exact:true}).isChecked()&&await p.getByRole('checkbox',{name:'Yapı Kredi World',exact:true}).isChecked()&&!await p.getByRole('checkbox',{name:'Akbank Axess',exact:true}).isChecked());
 await p.setViewportSize({width:390,height:844});await p.locator('.pos-options').scrollIntoViewIfNeeded();await p.screenshot({path:out+'/supplier-pos-mobile.png'});
 ok('POS dialog fits mobile viewport',await p.getByRole('dialog').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&el.scrollWidth<=el.clientWidth+1}));
 ok('POS checkbox rows keep mobile touch targets',await p.locator('.pos-options .check-label').evaluateAll(els=>els.every(el=>el.getBoundingClientRect().height>=44)));
 for(const name of ['Garanti Bonus','Yapı Kredi World'])await p.getByRole('checkbox',{name,exact:true}).uncheck();
 await p.locator('input[name=reason]').fill('POS seçimlerini temizleme');await p.getByRole('dialog').getByRole('button',{name:'Kaydet',exact:true}).click();await p.getByRole('dialog').waitFor({state:'hidden'});
 await p.setViewportSize({width:1440,height:1000});await supplier();ok('POS choices can all be cleared',await p.locator('.pos-options input:checked').count()===0);await close();
 await go('Cari hesaplar');await p.locator('.party-row').filter({hasText:'Ada Tasarım'}).click();await p.locator('.summary-band').getByRole('button',{name:'Düzenle',exact:true}).click();
 ok('POS options are absent for customer cards',await p.locator('.pos-options').count()===0&&await p.getByText('Opsiyonel özellikler',{exact:true}).count()===0);await close();
};
