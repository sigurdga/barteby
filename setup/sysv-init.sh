#! /bin/sh
### BEGIN INIT INFO
# Provides:             barteby
# Required-Start:       $syslog $remote_fs
# Required-Stop:        $syslog $remote_fs
# Should-Start:         $local_fs
# Should-Stop:          $local_fs
# Default-Start:        2 3 4 5
# Default-Stop:         0 1 6
# Short-Description:    barteby web site
# Description:          barteby web site
### END INIT INFO


# Adapted redis init file
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/srv/barteby/barteby/cluster.js
DAEMON_ARGS=
NAME=barteby
DESC=barteby
USER=www-data
GROUP=www-data

RUNDIR=/var/run/strekmann
PIDFILE=$RUNDIR/barteby.pid
LOGFILE=/srv/barteby/server.log

test -x $DAEMON || exit 0

set -e

export NODE_ENV=production
export PORT=13443
export DB_NAME=test

case "$1" in
start)
    echo -n "Starting $DESC: "
    mkdir -p $RUNDIR
    touch $PIDFILE
    chown $USER:$GROUP $RUNDIR $PIDFILE
    chmod 755 $RUNDIR

    if start-stop-daemon --start --quiet --umask 007 -m --pidfile $PIDFILE --chuid $USER:$GROUP --background --exec $DAEMON >> $LOGFILE
    then
            echo "$NAME."
    else
            echo "failed"
    fi
    ;;
stop)
    echo -n "Stopping $DESC: "
    if start-stop-daemon --stop --retry forever/TERM/1 --quiet --oknodo --pidfile $PIDFILE
    then
        echo "$NAME."
    else
        echo "failed"
    fi
    rm -f $PIDFILE
    sleep 1
    ;;
restart|force-reload)
    $0 stop
    $0 start
    ;;
status)
    echo -n "$DESC is "
    if start-stop-daemon --stop --quiet --signal 0 --pidfile ${PIDFILE}
    then
            echo "running"
    else
            echo "not running"
            exit 1
    fi
    ;;

*)
    echo "Usage: $0 {start|stop|restart|force-reload|status}"
    exit 1
    ;;
esac

exit 0
