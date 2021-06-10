# -*- encoding: utf-8 -*-
import os
import sys
import json

SCRIPT_PATH = os.path.dirname(os.path.abspath(__file__))
ROOT_PATH = SCRIPT_PATH + "/../../"
RES_PATH = ROOT_PATH + "resource/"

def parsesubKey(jsonfile):
    ret = ''
    with open(RES_PATH + jsonfile, mode="r") as f:
        read_s = f.readlines()
    for rline in read_s:
        if rline.find("frames") == -1 and rline.find(": {")> -1:
            s_pos = rline.find("\"")
            e_pos = rline.rfind("\"")
            ret += rline[s_pos+1:e_pos] + ","
    return ret
def typeByFile(filename):
    # tmpname = filename.rfind("/")
    endstr = ['.png','.jpg','.json','.fnt']
    ttype = ['image','image','json','font']
    for index in range(len(endstr)):
        if filename.find(endstr[index]) > -1:
            # print("endstr ",filename,endstr[index])
            return ttype[index]
def genRes(filepath):
    # print("fetch file ",filepath)
    s_pos = filepath.find("assets")
    filename = filepath[s_pos:len(filepath)]
    tmpname = filename.replace(".",'_')
    pos = tmpname.rfind("/")
    name = tmpname[pos+1:len(tmpname)]
    # print('tmpname ',tmpname)
    if tmpname.find("_DS_Store") == -1:
        block = "\
        {\n\
            \"url\": \"{0}\",\n\
            \"type\": \"{1}\",\n\
            \"name\": \"{2}\"\n\
        },"
        block = block.replace("{0}",tmpname).replace('{1}',typeByFile(filename)).replace('{2}',name)
        print(block)

    # return name,block
    # insert_str_in_line(ROOT_PATH + 'resource/defaults/' + COM_PATH,-2,name,block)
    # if len(group_name) > -1:
    #     writeGroup(group_name,name)
def genGroup(filepath):
    s_pos = filepath.find("assets")
    filename = filepath[s_pos:len(filepath)]
    tmpname = filename.replace(".",'_')
    pos = tmpname.rfind("/")
    name = tmpname[pos+1:len(tmpname)]
    return (name)

def fetch_dir(filepath):
    print("fetch dir >", filepath)
    keys = ['character','wear','weapon','mouth','eye',"proload",'wing','canvas']
    # idx = [1,2,3,4,5,6,7,8]
    vals = {
        'character' : "",
        'wear' : "",
        'weapon' : "",
        'mouth' : "",
        'eye' : "",
        'proload' : "",
        'wing' : "",
        'canvas' : "",
    }
    src = "{\
			\"keys\": \"{2}\",\
			\"name\": \"avatar_weapon\"\
		},\
		{\
			\"keys\": \"{6}\",\
			\"name\": \"avatar_wing\"\
		},\
		{\
			\"keys\": \"{1}\",\
			\"name\": \"avatar_wear\"\
		},\
		{\
			\"keys\": \"{0}\",\
			\"name\": \"avatar_character\"\
		},\
		{\
			\"keys\": \"{4}\",\
			\"name\": \"avatar_eye\"\
		},\
		{\
			\"keys\": \"{3}\",\
			\"name\": \"avatar_mouth\"\
		},\
		{\
			\"keys\": \"{5}\",\
			\"name\": \"avatar_preload\"\
		},\
		{\
			\"keys\": \"{7}\",\
			\"name\": \"avatar_canvas\"\
		}"
    for root, _, filenames in os.walk(filepath):
        for filename in filenames:
            # _, ext = os.path.splitext(filename)
            fullpath = os.path.join(root, filename)
            # print("fetch >", filepath)
            # genRes(filepath)
            # if fullpath.find('weapon') > -1 :
            #     weapon_key += genGroup(fullpath) + ','
            # if fullpath.find('wear') > -1 :
            #     wear_key += genGroup(fullpath) + ','
            for key in keys:
                if(fullpath.find(key)>-1):
                    vals[key] += genGroup(fullpath) + ','
    # params = []
    idx = 0
    for key in vals:
        # print(key)
        # params.append(vals[key])
        # block = block.replace("{0}",tmpname).replace('{1}',typeByFile(filename)).replace('{2}',name)
        # src = src.replace("{0}",vals[key])
        print("\"keys\"" + ":" + "\"" + vals[key] + "\"")
        print("\n")
        idx+=1
    print(src)
    # print(params)

    # dest = src.replace("{0}",params[0])
    # dest = src.format(params)
    # print(dest)
    # print(vals)
if __name__ == "__main__":
    print("gen res config")
    fetch_dir("/Users/yanghh/Documents/roh5/resource/assets/avatars/Preview")
    # 按文件夹分类遍历文件名 生成group
    # 同时不分类 生成resource