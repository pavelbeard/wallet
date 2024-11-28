class VerifyTokenError(Exception):
    """Verify token error."""

    def __init__(self, message):
        """Init exception."""
        self.message = message


class VerifyBackupTokenError(Exception):
    """Verify backup token error."""

    def __init__(self, message):
        """Init exception."""
        self.message = message
