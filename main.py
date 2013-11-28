from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

import jackal


class Jackal(webapp.RequestHandler):
    def get(self):
        if not users.get_current_user():
            self.redirect(users.create_login_url(self.request.uri))
            return
        s = ''
        try:
            s = self.request.uri.index('?')
        except ValueError:
            jackal.main(self)
            return

        get_arr = self.request.uri[s+1:].split('&')
        get = {}
        for b in get_arr:
            get[b[:b.index('=')]] = b[b.index('=')+1:]
        self.response.out.write(jackal.query(get))


application = webapp.WSGIApplication(
    [('/', Jackal)],
    debug=True)


def main():
    run_wsgi_app(application)


if __name__ == "__main__":
    main()