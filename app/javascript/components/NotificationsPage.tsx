import { Card } from 'flowbite-react'
import React from 'react'
import { buildCommitUrl, formatDiff, timeAgoInWords } from '../helpers/applicationHelper'
import { useMetricsIndex } from '../queries/user/metrics'
import { useNotificationsIndex, useNotificationsMarkAsSeen } from '../queries/user/notifications'

const NotificationsPage = () => {
  const { data: notifications } = useNotificationsIndex()
  const { data: metrics } = useMetricsIndex()
  const { mutate: markAsSeen } = useNotificationsMarkAsSeen()

  if (!notifications || !metrics) return null

  return (
    <div className="container">
      <h1>Notifications</h1>
      <p className="mb-3">To be notified about contributions to a metric, go to its page and watch for changes.</p>
      {notifications.length > 0 ? (
        notifications.map((notification) => {
          const metric = metrics.find((metric) => metric.id === notification.item.metric_id)

          if (!metric) return null

          return (
            <Card
              className="mb-3 dark:hover:bg-gray-700 cursor-pointer relative"
              key={notification.id}
              onClick={() => {
                window.open(
                  buildCommitUrl({ projectName: metric.project.name, commitSha: notification.item.commit_sha }),
                  '_blank'
                )
                markAsSeen(notification.id)
              }}
            >
              {!notification.seen_at && <div className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full" />}
              <div>
                {notification.item.author_name} contributed to the metric {metric.name} :{' '}
                {formatDiff(notification.item.diff)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {timeAgoInWords(notification.item.created_at)}
              </div>
            </Card>
          )
        })
      ) : (
        <Card>
          <div className="text-center text-gray-500">No notification yet</div>
        </Card>
      )}
    </div>
  )
}

export default NotificationsPage
