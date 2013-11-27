from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

import jackal


class Jackal(webapp.RequestHandler):
    def get(self):
        if not users.get_current_user():
            self.redirect(users.create_login_url(self.request.uri))
            return

        if not self.request.get('query'):
            jackal.main(self)
        else:
            self.response.out.write(jackal.query(self.request.get('query')))


application = webapp.WSGIApplication(
    [('/', Jackal)],
    debug=True)


def main():
    run_wsgi_app(application)


if __name__ == "__main__":
    main()