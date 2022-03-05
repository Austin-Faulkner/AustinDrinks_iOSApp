//
//  Device.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/7/22.
//

import Foundation
import UIKit

enum Device {
    static var isPhone: Bool {
        UIDevice.current.userInterfaceIdiom == .phone
    }
    static var isPad: Bool {
        UIDevice.current.userInterfaceIdiom == .pad
    }
}
