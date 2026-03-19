path = r'c:\Users\soporte\Desktop\Tecnology Solutions\soluciones.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
idx = content.index('</html>') + 7
clean = content[:idx]
with open(path, 'w', encoding='utf-8') as f:
    f.write(clean)
print(f'Done. Kept {idx} chars, removed {len(content)-idx} chars.')
