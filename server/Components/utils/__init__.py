from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent.parent))

import Components.utils.token_handlers
import Components.utils.Azure_api
import Components.utils.object_detection
import Components.utils.Spotify
import Components.utils.utilities
import Components.utils.Musixmatch