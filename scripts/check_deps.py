
try:
    import fontTools
    print("fontTools available")
except ImportError:
    print("fontTools missing")

try:
    import brotli
    print("brotli available")
except ImportError:
    print("brotli missing")
