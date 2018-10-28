//
//  ViewController.swift
//  IOT
//
//  Created by Navdeesh Ahuja on 28/10/18.
//  Copyright © 2018 Navdeesh Ahuja. All rights reserved.
//

import UIKit
import CocoaMQTT

class ViewController: UIViewController, CocoaMQTTDelegate {
    
    var mqtt:CocoaMQTT!

    @IBOutlet weak var location: UIImageView!
    
    @IBOutlet weak var floor: UIImageView!
    
    @IBOutlet weak var locationY: NSLayoutConstraint!
    
    @IBOutlet weak var locationX: NSLayoutConstraint!
    
    let MAX_X:CGFloat = 2000.0; // cm
    let MAX_Y:CGFloat = 2000.0; // cm
    
    var lgb=false;
    
    override func viewWillAppear(_ animated: Bool) {
        let lg = UILongPressGestureRecognizer(target: self, action: #selector(longTap))
        BBbutton.addGestureRecognizer(lg)
    }
    
    @objc func longTap(sender : UIGestureRecognizer){
        if sender.state == .ended {
            lgb=false
        }
        else if sender.state == .began {
            lgb=true
        }
    }
    

    
    @IBOutlet weak var BBbutton: UIButton!
    
    
    override func viewDidAppear(_ animated: Bool) {
        
    }
    
    override func didReceiveMemoryWarning() {
        // Destroy Resorces Here
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        mqtt = CocoaMQTT(clientID: "clientID", host: "broker.hivemq.com", port: 1883)
        mqtt.delegate = self
        mqtt.connect()
        locationY.constant = floor.frame.height/2;
        locationX.constant = floor.frame.width/2
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didConnectAck ack: CocoaMQTTConnAck) {
        mqtt.subscribe("iot-j-comp-play-topic-random-18219419194769")
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didPublishMessage message: CocoaMQTTMessage, id: UInt16) {
        
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didPublishAck id: UInt16) {
        
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didReceiveMessage message: CocoaMQTTMessage, id: UInt16) {
//        print("Message Received")
        if message.string != nil
        {
            if let stringData = message.string?.data(using: .utf8)
            {
                if let json = try? JSONSerialization.jsonObject(with: stringData, options: []) as? [String: Any]
                {
                    if json != nil
                    {
                        var x = json!["x"] as! CGFloat
                        var y = json!["y"] as! CGFloat
//                        print(x, y)
                        
                        x = max(0, x)
                        x = min(x, MAX_X)
                        y = max(0, y)
                        y = min(y, MAX_Y)
                        
                        let x_ratio = x/MAX_X
                        let y_ratio = y/MAX_Y
                        
                        let x_constant = x_ratio*floor.frame.width
                        let y_constant = y_ratio*floor.frame.height
                        
                        locationX.constant = x_constant
                        locationY.constant = y_constant
                    }
                }
            }
        }
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didSubscribeTopic topic: String) {
        print("Topic Subscribed")
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didUnsubscribeTopic topic: String) {
        
    }
    
    func mqttDidPing(_ mqtt: CocoaMQTT) {
        
    }
    
    func mqttDidReceivePong(_ mqtt: CocoaMQTT) {
        
    }
    
    func mqttDidDisconnect(_ mqtt: CocoaMQTT, withError err: Error?) {
        print("Disconnected")
    }


}

