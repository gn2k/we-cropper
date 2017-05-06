import weCropper from '../../src/weCropper.core.js'

const data = {
  id: 'cropper',
  width: 750,
  height: 750,
  minScale: 1,
  maxScale: 2.5,
  zoom: 8,
  src: ''
}

Page({
  data,
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    this.wecropper.getCropperImage((src) => {
      if (src) {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [src] // 需要预览的图片http链接列表
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  uploadTap () {
    let self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        Object.assign(data, { src })

        new weCropper(data)
          .on('ready', (ctx) => {
						console.log(`weCropper is ready`)
						console.log(`current canvas context: ${ctx}`)
						wx.showToast({
							title: '上传中',
							icon: 'loading',
							duration: 20000
						})
          })
          .on('load', (ctx) => {
						console.log(`picture loaded`)
						console.log(`current canvas context: ${ctx}`)
						wx.hideToast()
          })
					.on('beforeDraw', (ctx) => {
						console.log(`before canvas draw,i can do something`)
						console.log(`current canvas context: ${ctx}`)
						//  那就尝试在图片上加个水印吧
						ctx.setFontSize(20)
						ctx.setFillStyle('#ffffff')
						ctx.fillText('@dlhandsome', 200, 200)
					})
      }
    })
  },
  onLoad (option) {
    // do something
    if (option.src) {
      Object.assign(data, { src })
      new weCropper(data)
    }
  }
})
