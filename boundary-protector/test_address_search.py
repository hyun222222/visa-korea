import importlib.util, sys, os

# Load app.py as a module
app_path = os.path.abspath('c:/Projects/anti/boundary-protector/app.py')
spec = importlib.util.spec_from_file_location('app', app_path)
app = importlib.util.module_from_spec(spec)
sys.modules['app'] = app
spec.loader.exec_module(app)

addresses = [
    "서울시강남구테헤란로152",  # no spaces
    "서울시 강남구 테헤란로 152"  # with spaces
]
for addr in addresses:
    coords = app.get_coordinates(addr)
    print(f"Address: {addr} -> {coords}")
