import os

file_path = r'd:\vidmcq\backend\build.sh'
if os.path.exists(file_path):
    with open(file_path, 'rb') as f:
        content = f.read()
    
    # Simple conversion if it's text
    content = content.replace(b'\r\n', b'\n')
    
    with open(file_path, 'wb') as f:
        f.write(content)
    print(f"Successfully converted {file_path} to LF.")
else:
    print(f"{file_path} not found.")
