import Notification from '../models/Notification'

class NotificationRepository {
  async create(data) {
    return await Notification.create(data)
  }

  async findById(id) {
    return await Notification.findById(id)
      .populate('order')
      .populate('transaction')
      .populate('product')
  }

  async findAll(filters = {}) {
    return await Notification.find(filters)
      .populate('order')
      .populate('transaction')
      .populate('product')
      .sort({ createdAt: -1 })
  }

  async findUnread(filters = {}) {
    return await Notification.find({ isRead: false, ...filters })
      .populate('order')
      .populate('transaction')
      .populate('product')
      .sort({ createdAt: -1 })
  }

  async markAsRead(id) {
    return await Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true }
    )
  }

  async markAllAsRead() {
    return await Notification.updateMany(
      { isRead: false },
      { isRead: true, readAt: new Date() }
    )
  }

  async getUnreadCount(filters = {}) {
    return await Notification.countDocuments({ isRead: false, ...filters })
  }
}

export default new NotificationRepository()

