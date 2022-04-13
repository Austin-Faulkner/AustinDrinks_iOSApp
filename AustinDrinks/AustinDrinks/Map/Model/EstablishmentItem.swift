//
//  EstablishmentItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/7/22.
//

import UIKit
import MapKit

// JSON Decodable template
class EstablishmentItem: NSObject, MKAnnotation, Decodable {
    
    // All attributes and their types in the JSON data structure.
    let name: String?
    let establishmentID: Int?
    let open_for_business: Int?
    let tags: [String]
    let website: String  
    let longitude: Double?
    let latitude: Double?
    let address: String
    let postal_code: String
    let city: String
    let state: String
    let telephone: String?
    let price: String?
    var hours: [String: String]
    let accommodations: [String]
    let unaccommodations: [String]
    let rating_value: String?
    let rating_count: String?
    
    enum CodingKeys: String, CodingKey {
        case name = "name"
        case establishmentID = "id"
        case open_for_business = "open_for_business"
        case tags = "tags"
        case website = "website"
        case longitude = "longitude" 
        case latitude = "latitude"
        case address = "address"
        case postal_code = "postal_code"
        case city = "city"
        case state = "state"
        case telephone = "telephone"
        case price = "price"
        case hours = "hours"
        case accommodations = "accommodations"
        case unaccommodations = "unaccommodations"
        case rating_value = "rating_value"
        case rating_count = "review_count"
    }
    
    // Coordinate setter
    var coordinate: CLLocationCoordinate2D {
        guard let latitude = latitude, let longitude = longitude else {
            return CLLocationCoordinate2D()
        }
        return CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
    
    // Setter
    var title: String? {
        name
    }
    
    // Setter
    var estID: Int? {
        establishmentID
    }
    
    // Iterates through a list of tags, where tags in the code are understood to be
    // drinking establishment types--namely, brewery, distillery, or winery.
    var subtitle: String? {
        if tags.isEmpty {
            return ""
        } else if tags.count == 1 {
            return tags.first
        } else {
            return tags.joined(separator: ", ")
        }
    }
      
    // Iterates through a list of establishment accommodations
    var accommodation_attributes: String? {
        if accommodations.isEmpty {
            return ""
        } else if accommodations.count == 1 {
            return accommodations.first
        } else {
            return accommodations.joined(separator: "\n")
        }
    }
    
    // Decodable does not order an already unordered dictionary, so this function orders the hours of operation from
    // the beginning of the week to the end.
    func orderHoursOfOperations() -> [[String: String]] {
        let order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        var list_h: [[String: String]] = [[:]]
        for day in order {
            for (key, value) in hours {
                if (key == day) {
                    var dict: [String:String] = [:]
                    dict[key] = value
                    list_h.append(dict)
                    break
                }
            }
        }
        return list_h
    }
    
    // Returns the ordered hours of operation
    func hoursOfOperation() -> String {
        let h = orderHoursOfOperations()
        var hoursOfOp = ""
        for obj in h {
            for (key, value) in obj{
            hoursOfOp.append("\(key) : \(value)\n")
            }
        }
        return hoursOfOp
    }
    
    // Iterates through a list of what I'm calling "unaccommodations" or
    // other information one might like to know that is not an accommodation.
    // An example is "No pets allowed".
    var unaccommodation_attributes: String? {
        if unaccommodations.isEmpty {
            return ""
        } else if unaccommodations.count == 1 {
            return unaccommodations.first
        } else {
            return unaccommodations.joined(separator: "\n")
        }
    }
    
    // Setter
    var ratingVal: String? {
        rating_value
    }
    
    // Setter
    var ratingCount: String? {
        rating_count
    }
    
    // Setter
    var site: String {
        website
    }
}
