-- Module instantiation
local lfs = require"lfs"
print ("avatar check")
local sep = string.match (package.config, "[^\n]+")
local current = assert (lfs.currentdir())
local path = current .."/roh5/resource/assets/avatars/Preview"
local sum = 0
local haserror = {}
local ignore_list = {'130000033','Pose','boliguowang'}
function attrdir (path)
    for file in lfs.dir(path) do
        if file ~= "." and file ~= ".." then
            local f = path..sep..file
            
            local attr = lfs.attributes (f)
            assert (type(attr) == "table")
            if attr.mode == "directory" then
                attrdir (f)
            else
				-- print ("\t=> "..file.." <=")
				local is_canvas = string.find(file,'canvas')
				local endidx =  string.find(file,"_ske.json")
				local is_ignore = false
				-- for kig,vig in pairs(ignore_list) do
					if(string.find(file,ignore_list[1]) or
						string.find(file,ignore_list[2]) or
						string.find(file,ignore_list[3])) then 
						is_ignore = true
					end
				-- end
            	if endidx and (not is_canvas) and (not is_ignore) then 
            		print ("\t=> "..file.." <=")
            		sum = sum + 1
            		local file_text = io.open(f,"r")
            		local text = file_text:read("*a")
            		local id = string.sub(file,1,endidx-1)
            		local arname = string.find(text,id .. "Armature")
            		if not arname then local aerror = (file .. " miss " .. id .. "Armature") table.insert(haserror,aerror) end
            		if string.find(path,"character") then 
            			-- print ("\t=> "..file.." <=")
                        local guadian = string.find(text,"\"name\":\"chibangguadian\"")
	            		if not guadian then local aerror = (file .. " miss chibangguadian\n") table.insert(haserror,aerror) end
	            		guadian = string.find(text,"\"name\":\"wuqiguadian\"")
	            		if not guadian then local aerror = (file .. " miss wuqiguadian") table.insert(haserror,aerror) end
	            		guadian = string.find(text,"\"name\":\"toushiguadian\"")
	            		if not guadian then local aerror = (file .. " miss toushiguadian\n") table.insert(haserror,aerror) end
						guadian = string.find(text,"\"name\":\"toushiguadian1\"")
	            		if not guadian then local aerror = (file .. " miss toushiguadian1\n") table.insert(haserror,aerror) end
	            		guadian = string.find(text,"\"name\":\"zuishiguadian\"")
	            		if not guadian then local aerror = (file .. " miss zuishiguadian\n") table.insert(haserror,aerror) end
	            		guadian = string.find(text,"\"name\":\"yanshiguadian\"")
	            		if not guadian then local aerror = (file .. " miss yanshiguadian\n") table.insert(haserror,aerror) end
	            		guadian = string.find(text,"R-thumb\",")
	            		if not guadian then local aerror = ("\t"..file .. " miss R-thumb\n") table.insert(haserror,aerror) end
	            		guadian = string.find(text,"R-hand\",")
	            		if not guadian then local aerror = ("\t"..file .. " miss R-hand\n") table.insert(haserror,aerror) end
            		end
            	end

            end
        end
    end
end
attrdir(path)
print("avatar sum ==> ",sum)
for k,v in pairs(haserror) do
    print(k,v)
end
-- print((print("11")))
-- if haserror then print("has error") end