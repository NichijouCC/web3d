namespace web3d
{
    declare var GameGlobal: any;
    declare var wx: any;
    class internalDocument
    {
        createElement(tagName)
        {
            tagName = tagName.toLowerCase()
            if (tagName === 'canvas') {
                return wx.createCanvas()
            }
            else if (tagName === 'image') {
                return wx.createImage()
            }
        }
    }
    
    function Image()
    {
        return wx.createImage();
    }
    
    
    export class wxAdapter
    {
        static apply()
        {
            let root:any=GameGlobal;
            root.Image=Image;
            root.document=internalDocument;
        }
    }
}
