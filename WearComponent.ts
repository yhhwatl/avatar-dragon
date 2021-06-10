/*
 * @Date: 2021-02-08 16:47:24
 * @LastEditors: yanghh
 * @LastEditTime: 2021-02-19 10:22:42
 * @FilePath: /roh5/src/Utils/avatar/WearComponent.ts
 */
module ro1 {
    export class WearTComponernt extends AvatarComponent {
        constructor(avatarid:number) {
            super(avatarid);
            this.slotName = "toushiguadian";
            
        }
        async setChildLayer() {
            this.layer = this.personArmature.display.numChildren - 1;
            //TODO 双层帽子被身体遮盖 cfg.Layer = 0 
            // this.setBackLayer();
            super.setChildLayer();
        }
        async setBackLayer() {
            let toubackSlot = this.personArmature.getSlot("toushiguadian1");
            if(this.skename.indexOf("_1")<0) this.skename += "_1";
            // if (cfg.Layer == 0) slayer = 0;//被身体挡住
            // this.layer = 0;
            if (toubackSlot) {
                let armature = await avatarUtils.getArmature(this.skename);
                if (armature) {
                    let prevChildArmature = toubackSlot.childArmature;
                    if (prevChildArmature) {
                        prevChildArmature.dispose();
                    }
                    toubackSlot.childArmature = armature;
                    armature.display.parent.setChildIndex(armature.display, 0);
                } else {
                    toubackSlot.display = null;
                }
            }
        }
        
    }
    export class WearMComponernt extends AvatarComponent {
        constructor(avatarid:number) {
            super(avatarid);
            this.slotName = "yanshiguadian";
        }
        async setChildLayer() {
            this.layer = this.personArmature.display.numChildren - 1;
            super.setChildLayer();
        }
    }
    export class WearBComponernt extends AvatarComponent {
        constructor(avatarid:number) {
            super(avatarid);
            this.slotName = "zuishiguadian";
        }
        async setChildLayer() {
            this.layer = this.personArmature.display.numChildren - 1;
            super.setChildLayer();
        }
    }
}