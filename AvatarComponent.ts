/*
 * @Date: 2021-02-08 11:04:20
 * @LastEditors: yanghh
 * @LastEditTime: 2021-02-18 17:53:19
 * @FilePath: /roh5/src/Utils/avatar/AvatarComponent.ts
 */
module ro1 {
    export let dragFactory:dragonBones.EgretFactory = null;
    export interface IAvatarRes {
        avatarid:number,
        skename:string,
        texname:string,
        skeletonData:any,
        textureData:any,
        texture:any,
    }
    export enum SlotName {
        chibang,
    }
    
    export class AvatarUtils implements ro.IAnimatable {
        
        private avatarResData:ro.Dictionary<string,IAvatarRes> = null;
        private avatarArmatureData:ro.Dictionary<string,dragonBones.Armature> = null;
        constructor() {
            if(dragFactory == null) 
                dragFactory = new dragonBones.EgretFactory();
            this.avatarResData = new ro.Dictionary<string, IAvatarRes>();
            this.avatarArmatureData = new ro.Dictionary<string,dragonBones.Armature>();
        }
        advanceTime(dt: number): void {
            if(dragFactory)
                dragFactory.clock.advanceTime(dt / 1000);
        }
        loadDragonData(skename: string) {
            let resData = this.avatarResData.get(skename);
            if(!resData) {
                console.error("load res first");
                return;
            }
            this.getDragonData(resData);
        }
        buildArmature(skename: string):dragonBones.Armature {
            if(this.avatarArmatureData.containsKey(skename)) {
                return <dragonBones.Armature> this.avatarArmatureData.get(skename);
            }
            this.loadDragonData(skename);
            let dname = skename + "";
            let armane = dname + "Armature";
            let armature = dragFactory.buildArmature(armane,dname);
            armature.clock = dragFactory.clock;
            armature.animation.timeScale = 0.5;
            armature.animation.play("newAnimation");
            this.avatarArmatureData.push(skename,armature);
            return armature;
        }
        async getDisplay(skename: string):Promise<any> {
            return new Promise((resolve)=>{
                this.getArmature(skename).then((armature)=>{
                    resolve(armature.display);
                });
            });
        }
        async getArmature(skename: string):Promise<any> {
            
            return new Promise((resolve)=>{
                this.loadAssert(skename).then(()=>{
                    let armature = this.buildArmature(skename);
                    resolve(armature);
                })
            });
        }
        clearAvatarData(skename:string) {
            this.removeDragonData(skename);
            this.disposeArmature(skename); 
            this.avatarResData.remove(skename);
            this.avatarArmatureData.remove(skename);
        }
        disposeArmature(skename:string) {
            let armature = this.avatarArmatureData.get(skename);
            if(armature) {
                armature.dispose();
            }
        }
        getDragonData(resData:IAvatarRes) {
            let dname = resData.avatarid + "";
            let bonedata = dragFactory.getDragonBonesData(resData.skename);
            let texdata = dragFactory.getTextureAtlasData(resData.texname);
            if(!bonedata || !texdata) {
                dragFactory.parseDragonBonesData(resData.skeletonData,resData.skename);
                dragFactory.parseTextureAtlasData(resData.textureData,resData.texture,resData.texname);
            }
        }
        /**
         * @param disposeData - 是否释放数据。 （默认: true）
        */
        removeDragonData(skename:string,disposeData: boolean = true) {
            let dname = skename + "";
            let texname = this.parseTexname(skename);
            dragFactory.removeDragonBonesData(dname,disposeData);
            dragFactory.removeTextureAtlasData(texname,disposeData);
        }
        async loadAssert(skename:string):Promise<any> {
            return new Promise((resolve)=>{
                if(this.avatarResData.containsKey(skename)) {
                    resolve(<IAvatarRes>this.avatarResData.get(skename));
                } else {
                    let self = this;
                    self.getRes(skename).then((res:IAvatarRes)=>{
                        self.avatarResData.push(skename,res);
                        resolve(res);
                    });
                }
            });
        }
        async getRes(skename:string) {
            return new Promise((resolve)=>{
                let res = <IAvatarRes> {};
                res.skename = skename;
                //parse texname
                res.texname = this.parseTexname(skename);
                ro.getAsset(skename + "_ske_json", function (data1) {
                    res.skeletonData = data1;
                    ro.getAsset(res.texname + "_tex_json", function (data2) {
                        res.textureData = data2;
                        ro.getAsset(res.texname + "_tex_png", function (data3) {
                            res.texture = data3;
                            resolve(res);
                        }, this);
                    }, this);
                }, this);
            });
        }
        
        parseTexname(skename:string) {
            let texname = skename;//大部分情况 texname = skename
            let idx = skename.indexOf("_1");//_1这种是共享texture 
            if( idx > -1) {
                texname = skename.substr(0,idx);
            }
            return texname;
        }
    }
    export let avatarUtils = new AvatarUtils();
    export class AvatarComponent extends egret.HashObject {
        protected slotName:string = "def";//部位名称
        protected layer = 0;
        protected skename:string = "";//ID
        protected personArmature:dragonBones.Armature = null;//身体
        constructor(avatarid:number) {
            super();
            this.skename = avatarid + "";
        }
        async getArmature() {
            let armature:dragonBones.Armature = await avatarUtils.getArmature(this.skename);
            return armature;
        }
        async getDisplay() {
            let display:egret.DisplayObjectContainer = await avatarUtils.getDisplay(this.skename);
            return display;
        }
        clear() {
            avatarUtils.clearAvatarData(this.skename);
        }
        addTo(personArmature:dragonBones.Armature) {
            this.personArmature = personArmature;
            this.getArmature().then((armature)=>{
                let slot = personArmature.getSlot(this.slotName);
                // slot.displayIndex = 1;//？？
                // if(slot.childArmature) {
                //     slot.childArmature.dispose();
                // }
                let display:egret.DisplayObjectContainer = armature.display;
                if(display)display.name = this.skename + "";
                slot.childArmature = armature;
                this.setChildLayer();
            });
            
        }
        async setChildLayer() {
            let armature = await this.getArmature();
            armature.animation.timeScale = 0;
            let slotName = this.slotName;
            let slot = this.personArmature.getSlot(slotName);
            let display:egret.DisplayObjectContainer = slot && slot.display;
            if(display && display.parent) {
                display.parent.setChildIndex(display, this.layer);
            }
        }
    }
}