local lfs = require"lfs"
print ("avatar check")
local sep = string.match (package.config, "[^\n]+")
local current = assert (lfs.currentdir())
local path = "/Users/dream001/Downloads/武器整理0603/"
local newpath = "/Users/dream001/Downloads/武器整理0603/111/"
-- lfs.mkdir(newpath)
function common_copy(sourcefile,destinationfile)
    print(sourcefile,destinationfile)
    local temp_content ="";
    io.input(sourcefile)
    temp_content = io.read("*a")
    io.output(destinationfile)
    io.write(temp_content)
    io.flush()
    io.close()
end
--------------------- 
local sum = 0
function copyFiles (path)
    for file in lfs.dir(path) do
        if file ~= "." and file ~= ".." then
            local f = path..sep..file
            
            local attr = lfs.attributes (f)
            assert (type(attr) == "table")
            if attr.mode == "directory" then
                copyFiles (f)
            else
                if file ~= ".DS_Store" then
                    print ("\t=> "..file.." <=")
                    local endidx =  string.find(file,"_ske.json")
	            	-- if endidx then
	            	-- 	local file_text = io.open(f,"r")
	            	-- 	local text = file_text:read("*a")
	            	-- 	local arname = string.find(text,"hou")
	            	-- 	if arname then 
	            	-- 		sum = sum + 1
	            	-- 	end
	                    common_copy(f,newpath..file)
	             --    end
                end
            end
        end
    end
end

copyFiles(path)
print(sum)