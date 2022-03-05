//
//  EstablishmentItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/7/22.
//

import UIKit
import MapKit
//import OrderedCollections

class EstablishmentItem: NSObject, MKAnnotation, Decodable {
    
    let name: String?
    let establishmentID: Int?
    let open_for_business: Int?
    let tags: [String]
    let website: String  // unwrapped to fix Go button in DrinkingEstablishmentListViewController
    let longitude: Double?
    let latitude: Double?
    let address: String//?
    let postal_code: String//? // THESE ARE 'UNWRAPPED' FOR EstablishmentDetailViewController's USE
    let city: String//?
    let state: String//?
    let telephone: String?
    let price: String?
    var hours: [String: String]
    let accommodations: [String]
    let unaccommodations: [String]
    let rating_value: String?
    let rating_count: String?
    let reviews: [[String: String]] // Need to figure out how to navigate for the reviews on the EstablishmentDetailViewController page
    
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
        case reviews = "reviews"
    }
    
    var coordinate: CLLocationCoordinate2D {
        guard let latitude = latitude, let longitude = longitude else {
            return CLLocationCoordinate2D()
        }
        return CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
    
    var title: String? {
        name
    }
    
    var estID: Int? {
        establishmentID
    }
    
    var subtitle: String? {
        if tags.isEmpty {
            return ""
        } else if tags.count == 1 {
            return tags.first
        } else {
            return tags.joined(separator: ", ")
        }
    }
        
    var accommodation_attributes: String? {
        if accommodations.isEmpty {
            return ""
        } else if accommodations.count == 1 {
            return accommodations.first
        } else {
            return accommodations.joined(separator: "\n")
        }
    }
    
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
    
    var unaccommodation_attributes: String? {
        if unaccommodations.isEmpty {
            return ""
        } else if unaccommodations.count == 1 {
            return unaccommodations.first
        } else {
            return unaccommodations.joined(separator: "\n")
        }
    }
    
    var ratingVal: String? {
        rating_value
    }
    
    var ratingCount: String? {
        rating_count
    }
    
    var site: String {
        website
    }
}
