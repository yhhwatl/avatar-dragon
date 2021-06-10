/*
 * @Date: 2021-02-08 16:05:41
 * @LastEditors: yanghh
 * @LastEditTime: 2021-02-19 11:16:57
 * @FilePath: /roh5/src/Utils/avatar/WeaponComponent.ts
 */
module ro1 {
    export class WeaponComponent extends AvatarComponent {
        constructor(avatarid:number) {
            super(avatarid);
            this.slotName = "wuqiguadian"
        }
        async setChildLayer() {
            // this.setThumbLayer();
            super.setChildLayer();
            //TODO 盗贼左手武器
            this.setLeftLayer();
        }
        //调节拇指层级
        async setThumbLayer() {
            let armature = await this.getArmature();
            let display = this.personArmature.display;
            armature.animation.timeScale = 0;
            let slotName = this.slotName;
            let slot_pre = "";
            if (slotName == "weapon-L") {//调整拳头和武器层级 
                slot_pre = "L-";
            } else {
                slot_pre = "R-";
            }
            let slayer = 0;
            let thrumbslotLayer = 0;
            let thrumbslot = this.personArmature.getSlot(slot_pre + "thumb");
            if (thrumbslot) {
                thrumbslotLayer = display.parent.getChildIndex(thrumbslot.display);
                slayer = thrumbslotLayer - 1;
            }
            let thrumbslot1 = this.personArmature.getSlot(slot_pre + "hand");
            if (thrumbslot1) {
                slayer = display.parent.getChildIndex(thrumbslot1.display);
                if (slot_pre == "R-") {
                    if(thrumbslot1.display.parent) {
                        thrumbslot1.display.parent.setChildIndex(thrumbslot1.display, 0);
                    }
                }   
                else {
                    if(thrumbslot1.display.parent) {
                        thrumbslot1.display.parent.setChildIndex(thrumbslot1.display, slayer);//双层武器左手在最上面
                    }
                }   
            }
            this.layer = slayer + 1;//右手的武器在手指0上面
        }
        //盗贼左手武器
        setLeftLayer() {
            // if(1) {
            //     let slotName = "weapon-L";
            //     let slot = this.personArmature.getSlot(slotName);
            //     if (slot) {
            //         slot.displayIndex = 1;
            //         this.setThumbLayer();
            //     }
            // }
        }
    }
}