import connectDB from '../../../lib/db/mongoose'
import notificationRepository from '../../../domain/repositories/NotificationRepository'
import { getAdminSession } from '../../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'
import Card from '../../../components/ui/Card'
import Link from 'next/link'

async function markAsReadAction(id) {
  'use server'
  await connectDB()
  await notificationRepository.markAsRead(id)
}

export default async function AdminNotificationsPage() {
  const admin = await getAdminSession()
  
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  const notifications = await notificationRepository.findAll()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>

      <Card>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id.toString()}
                className={`p-4 border-l-4 ${
                  notification.isRead
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    {notification.order && (
                      <Link
                        href={`/admin/orders/${notification.order._id}`}
                        className="text-primary-600 hover:underline mt-2 inline-block"
                      >
                        View Order →
                      </Link>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <form action={markAsReadAction.bind(null, notification._id.toString())}>
                      <button
                        type="submit"
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        Mark as read
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

