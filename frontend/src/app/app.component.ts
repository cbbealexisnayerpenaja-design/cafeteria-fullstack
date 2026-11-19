import {Component,OnInit,inject,signal,computed} from '@angular/core';
import {CommonModule} from '@angular/common';import {FormsModule} from '@angular/forms';
import {ApiService} from './api.service';import {Content} from './models';
@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./app.component.html'})
export class AppComponent implements OnInit {
 private api=inject(ApiService);data=signal<Content|null>(null);loading=signal(true);error=signal('');
 selectedCategory=signal(0);menuOpen=signal(false);chatOpen=signal(false);chatLoading=signal(false);
 chatInput='';messages=signal<{from:'bot'|'user';text:string}[]>([{from:'bot',text:'¡Hola! ☕ Soy tu asistente virtual. Pregúntame sobre nuestros cafés, precios, servicios o dirección.'}]);
 contact={name:'',email:'',phone:'',message:''};sending=signal(false);contactStatus=signal('');
 products=computed(()=>{const d=this.data();return d?d.products.filter(p=>this.selectedCategory()===0||p.category_id===this.selectedCategory()):[]});
 featured=computed(()=>this.data()?.products.filter(p=>p.featured).slice(0,3)||[]);
 ngOnInit(){this.api.content().subscribe({next:d=>{this.data.set(d);this.loading.set(false);document.title=`${d.site.site_name} · Cafetería`;document.documentElement.style.setProperty('--accent',d.site.primary_color||'#c58c5b');},error:()=>{this.error.set('No se pudo cargar la cafetería. Verifica que Node.js y MySQL estén funcionando.');this.loading.set(false);}})}
 goto(){this.menuOpen.set(false)}
 sendContact(){if(this.sending())return;this.sending.set(true);this.contactStatus.set('');this.api.contact(this.contact).subscribe({next:r=>{this.contactStatus.set(r.message);this.contact={name:'',email:'',phone:'',message:''};this.sending.set(false);},error:e=>{this.contactStatus.set(e.error?.error||'No se pudo enviar el mensaje.');this.sending.set(false);}})}
 sendChat(){const msg=this.chatInput.trim();if(!msg||this.chatLoading())return;this.messages.update(m=>[...m,{from:'user',text:msg}]);this.chatInput='';this.chatLoading.set(true);this.api.chat(msg).subscribe({next:r=>{this.messages.update(m=>[...m,{from:'bot',text:r.response}]);this.chatLoading.set(false);},error:()=>{this.messages.update(m=>[...m,{from:'bot',text:'Por ahora no puedo responder. Comprueba que Ollama esté encendido.'}]);this.chatLoading.set(false);}})}
}
