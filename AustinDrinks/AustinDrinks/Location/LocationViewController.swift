//
//  LocationViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 4/1/22.
//

import UIKit

// PRovides for the menu of 11 cities in the Austin, TX and surrounding areas in the Hill Country
class LocationViewController: UIViewController {

    let manager = LocationDataManager()
    var selectedCity: LocationItem?
    
    @IBOutlet weak var tableView: UITableView! 
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    // Sets a Checkmark next to the chosen city such there there exist a 1-1 mapping between user choice
    // and craft-beverage city options
    func setCheckmark(for cell: UITableViewCell, location: LocationItem) {
        if selectedCity == location {
            cell.accessoryType = .checkmark
        } else {
            cell.accessoryType = .none
        }
    }
}

// MARK: Private Extension
private extension LocationViewController {
    func initialize() {
        manager.fetch()
        title = "Choose a destination"
        navigationController?.navigationBar.prefersLargeTitles = true
    }
}

// MARK: UITableViewDataSource
extension LocationViewController: UITableViewDataSource {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        manager.numberOfLocationsItems()
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "locationCell", for: indexPath)
        let location = manager.locationItem(at: indexPath.row)
        cell.textLabel?.text = location.cityAndState
        setCheckmark(for: cell, location: location)
        return cell
    }
    
    // ADDED:
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> Int {
        let cell = tableView.dequeueReusableCell(withIdentifier: "locationCell", for: indexPath)
        let location = manager.locationItem(at: indexPath.row)
        setCheckmark(for: cell, location: location)
        return Int((location.city)!)!
    }
}

// MARK: UITableViewDelegate
extension LocationViewController: UITableViewDelegate {
                                                                                    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if let cell = tableView.cellForRow(at: indexPath) {
            cell.accessoryType = .checkmark
            selectedCity = manager.locationItem(at: indexPath.row)
            tableView.reloadData()
        }
    }
}

