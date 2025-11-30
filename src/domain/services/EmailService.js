import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

class EmailService {
  async sendOrderConfirmation(order, customerEmail) {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: this.generateOrderConfirmationEmail(order),
    }

    return await transporter.sendMail(mailOptions)
  }

  async sendOrderAlert(order) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmail,
      subject: `New Order Received - ${order.orderNumber}`,
      html: this.generateOrderAlertEmail(order),
    }

    return await transporter.sendMail(mailOptions)
  }

  generateOrderConfirmationEmail(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0ea5e9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .item { padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
          </div>
          <div class="content">
            <p>Thank you for your order!</p>
            <div class="order-details">
              <h2>Order #${order.orderNumber}</h2>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              
              <h3>Items:</h3>
              ${order.items.map(item => `
                <div class="item">
                  <p><strong>${item.productName}</strong></p>
                  <p>Size: ${item.variant.size} | Color: ${item.variant.color}</p>
                  <p>Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${item.total.toFixed(2)}</p>
                </div>
              `).join('')}
              
              <div class="total">
                <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
                <p>Shipping: $${order.shippingCost.toFixed(2)}</p>
                <p>Tax: $${order.tax.toFixed(2)}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  generateOrderAlertEmail(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Order Alert</h1>
          </div>
          <div class="content">
            <p>A new order has been received:</p>
            <div class="order-details">
              <h2>Order #${order.orderNumber}</h2>
              <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
              <p><strong>Items:</strong> ${order.items.length}</p>
              <p><a href="${process.env.APP_URL}/admin/orders/${order._id}">View Order</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

export default new EmailService()

