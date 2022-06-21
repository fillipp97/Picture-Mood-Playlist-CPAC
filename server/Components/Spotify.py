import spotipy

class Spoty: 
    token=''

    def __init__ (self):
        pass
    def get_preferences(self):
        sp = spotipy.Spotify(auth=session.get('token_info').get('access_token'))
        top_tracks= sp.current_user_top_tracks(limit=20,offset=0, time_range='medium_term')['items']
        print(top_tracks[0]['track'])
    def get_suggested(self):
        self.get_preferences()
    
