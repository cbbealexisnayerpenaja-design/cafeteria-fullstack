export interface Site {site_name:string;tagline:string;hero_title:string;hero_subtitle:string;hero_video_url:string;hero_poster_url:string;logo_url:string;primary_color:string;currency:string}
export interface About {title:string;history:string;mission:string;address:string;city:string;phone:string;email:string;hours:string;map_url:string}
export interface Service {id:number;title:string;description:string;icon:string}
export interface Category {id:number;name:string;description:string}
export interface Product {id:number;category_id:number;category_name:string;name:string;description:string;price:number;image_url:string;featured:number}
export interface Gallery {id:number;image_url:string;alt_text:string}
export interface Social {id:number;platform:string;url:string}
export interface Content {site:Site;about:About;services:Service[];categories:Category[];products:Product[];gallery:Gallery[];socials:Social[]}
