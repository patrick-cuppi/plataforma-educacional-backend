import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'
import AdminJS from 'adminjs'
import bcrypt from 'bcrypt'
import { sequelize } from '../database'
import { User } from '../models'
import { adminJsResource } from './resources'

AdminJS.registerAdapter(AdminJSSequelize)

export const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
  resources: adminJsResource,
  branding: {
    companyName: 'OneBitFlix',
    logo: '/logoOnebitflix.svg',
    theme: {
      colors: {
        primary100: '#ff0043',
        primary80: '#ff1a57',
        primary60: '#ff3369',
        primary40: '#ff4d7c',
        primary20: '#ff668f',
        grey100: '#151515',
        grey80: '#333333',
        grey60: '#4d4d4d',
        grey40: '#666666',
        grey20: '#dddddd',
        filterBg: '#333333',
        accent: '#151515',
        hoverBg: '#151515',
      },
    },
  },
})

export const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      const user = await User.findOne({
        where: {
          email,
        },
      })

      if (user && user.role === 'admin') {
        const matched = await bcrypt.compare(password, user.password)

        if (matched) {
          return user
        }
      }

      return false
    },
    cookiePassword: 'senha-de-cookie',
  },
  null,
  {
    resave: false,
    saveUninitialize: false,
  }
)
