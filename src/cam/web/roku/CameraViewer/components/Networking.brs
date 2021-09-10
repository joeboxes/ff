' Networking.brs

'sub init()
'	print("init - Networking")
'end sub

sub init()
    print("init - Networking")
    m.top.functionName = "getContent"
    m.top.status = "waiting"
end sub

sub getContentX()
    print("getContent")
    print(m.top.poster)
    print(m.top.cameraID)
end sub

sub getContent()
    cameraID = m.top.cameraID
    poster = m.top.poster

    date = CreateObject("roDateTime")
    time = date.AsSeconds()
    print time

'    print("getContent")
    baseURL = "http://192.168.0.140/web/ff/cam/web/distributionServer/index.php"
'    print(baseURL)
'    print(cameraID)
    requestURL = baseURL+"?path=%2Fcamera%2F"+cameraID+"%2Fimage"+"&nonce="+time.ToStr()
    print(requestURL)
    request = CreateObject("roUrlTransfer")
'    print(request)
    
    request.SetURL(requestURL)
    
    response = request.GetToString()
'     print ("response: " + response)
    
    jsonObject = ParseJson(response)
    
    result = jsonObject.result
    print ("result: " + result)
    
    if result = "success"
        print "SUCCESS"
    else
        print "FAILURE"
        ' TODO: set image to error
        return
    end if
    
    data = jsonObject.data
    base64 = data.base64
    print "base64 "+Len(base64).ToStr()
    
    ba = CreateObject("roByteArray")
    ba.FromBase64String(base64)

    print "saving to file"
    tempFilePath = "tmp:/temp"+time.ToStr()+".png"
    ba.WriteFile(tempFilePath)

    print "done file save"
    
    poster.uri = tempFilePath
    
    m.top.status = "complete"
end sub

' get image
sub RequestJsonImageX(component)
    request = CreateObject("roUrlTransfer")
    ' print(request)
    
    print(url)
    request.SetURL(url)
    response = request.GetToString()
    print ("response: " + response)
    
    result = response.result
    
    
    
    
    
end sub
